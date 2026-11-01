// Testes do gateway mock da denúncia (anonimato, risco imediato, protocolo e falha no primeiro envio) · API: nenhuma
import { describe, expect, it } from "vitest";
import { createMockReports } from "./mockReports";
import { REPORT_ERRORS } from "./reportContract";

const timing = { submit: 0 };
const open = { failFirst: false };

describe("createMockReports", () => {
  it("registra denúncia comum como anônima e na fila", async () => {
    const receipt = await createMockReports(timing, open).submit({ reason: "comportamento_suspeito" });
    expect(receipt).toMatchObject({ immediate: false, anonymous: true, preventiveSuspension: false });
  });

  it("risco imediato não é anônimo e suspende o perfil", async () => {
    const receipt = await createMockReports(timing, open).submit({ reason: "risco_imediato" });
    expect(receipt).toMatchObject({ immediate: true, anonymous: false, preventiveSuspension: true });
  });

  it("gera protocolos em sequência", async () => {
    const reports = createMockReports(timing, open);
    const first = await reports.submit({ reason: "outro", description: "texto" });
    const second = await reports.submit({ reason: "outro" });
    expect(first.protocol).toBe("KR-0001");
    expect(second.protocol).toBe("KR-0002");
  });

  it("recusa motivo desconhecido", async () => {
    await expect(createMockReports(timing, open).submit({ reason: "x" })).rejects.toMatchObject({
      code: REPORT_ERRORS.INVALID,
    });
  });

  it("falha no primeiro envio e funciona no segundo", async () => {
    const reports = createMockReports(timing);
    await expect(reports.submit({ reason: "outro" })).rejects.toMatchObject({ code: REPORT_ERRORS.SEND_FAILED });
    await expect(reports.submit({ reason: "outro" })).resolves.toMatchObject({ protocol: "KR-0001" });
  });
});
