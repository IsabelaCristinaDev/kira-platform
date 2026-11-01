// Testes do gateway mock do Provador (consentimento, falha na primeira geração e exclusão de fotos) · API: nenhuma
import { describe, expect, it } from "vitest";
import { TRYON_CONSENT_VERSION, TRYON_ERRORS } from "./tryOnContract";
import { createMockTryOn } from "./mockTryOn";

const timing = { consent: 0, generate: 0 };
const photos = { referenceUri: "ref.jpg", photoUri: "foto.jpg" };

describe("createMockTryOn", () => {
  it("começa sem consentimento", async () => {
    expect(await createMockTryOn(timing).getConsent()).toEqual({ accepted: false });
  });

  it("não gera prévia sem consentimento", async () => {
    await expect(createMockTryOn(timing).generate(photos)).rejects.toMatchObject({
      code: TRYON_ERRORS.CONSENT_REQUIRED,
    });
  });

  it("guarda versão e data ao aceitar", async () => {
    const tryOn = createMockTryOn(timing);
    const consent = await tryOn.acceptConsent(TRYON_CONSENT_VERSION);
    expect(consent).toMatchObject({ accepted: true, version: TRYON_CONSENT_VERSION });
    expect(consent.acceptedAt).toBeTruthy();
    expect(await tryOn.getConsent()).toEqual(consent);
  });

  it("falha na primeira geração e funciona na segunda", async () => {
    const tryOn = createMockTryOn(timing);
    await tryOn.acceptConsent();
    await expect(tryOn.generate(photos)).rejects.toMatchObject({ code: TRYON_ERRORS.GENERATION_FAILED });
    const result = await tryOn.generate(photos);
    expect(result.resultUri).toBe("foto.jpg");
  });

  it("não falha quando failFirst está desligado", async () => {
    const tryOn = createMockTryOn(timing, { failFirst: false });
    await tryOn.acceptConsent();
    await expect(tryOn.generate(photos)).resolves.toBeTruthy();
  });

  it("revogar apaga as fotos e bloqueia novas gerações", async () => {
    const tryOn = createMockTryOn(timing, { failFirst: false });
    await tryOn.acceptConsent();
    await tryOn.generate(photos);
    expect(tryOn._storedPhotos()).toBe(2);
    await tryOn.revokeConsent();
    expect(tryOn._storedPhotos()).toBe(0);
    await expect(tryOn.generate(photos)).rejects.toMatchObject({ code: TRYON_ERRORS.CONSENT_REQUIRED });
  });

  it("apaga as fotos sem revogar o consentimento", async () => {
    const tryOn = createMockTryOn(timing, { failFirst: false });
    await tryOn.acceptConsent();
    await tryOn.generate(photos);
    await tryOn.deletePhotos();
    expect(tryOn._storedPhotos()).toBe(0);
    expect((await tryOn.getConsent()).accepted).toBe(true);
  });
});
