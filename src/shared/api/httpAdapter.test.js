// Testes do adaptador HTTP: horários livres por funcionária e remarcar pelo estúdio · fetch simulado
import { afterEach, describe, expect, it, vi } from "vitest";
import { httpAdapter as api } from "./httpAdapter";

const json = (status, body) => new Response(JSON.stringify(body), { status });
const slot = (hora) => ({ dataHoraInicio: `2026-11-10T${hora}:00` });
const businessRule = () => json(400, { erro: "REGRA_DE_NEGOCIO", mensagem: "x" });
const date = new Date(2026, 10, 10);
const appointment = { proId: "e1", serviceId: "s1", staffId: "f1" };
const urls = (fetch) => fetch.mock.calls.map(([url]) => String(url));

afterEach(() => vi.unstubAllGlobals());

describe("availability.forAppointment", () => {
  it("pede os horários da funcionária do atendimento", async () => {
    const fetch = vi.fn().mockResolvedValue(json(200, [slot("09:00")]));
    vi.stubGlobal("fetch", fetch);
    expect(await api.availability.forAppointment({ appointment, date })).toEqual(["09:00"]);
    expect(urls(fetch)[0]).toContain(
      "/api/empresas/e1/disponibilidade/slots?servicoId=s1&data=2026-11-10&funcionariaId=f1",
    );
  });

  it("com a funcionária desativada, usa os horários do estúdio", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(businessRule())
      .mockResolvedValueOnce(json(200, [slot("10:30")]));
    vi.stubGlobal("fetch", fetch);
    expect(await api.availability.forAppointment({ appointment, date })).toEqual(["10:30"]);
    expect(urls(fetch)[1]).not.toContain("funcionariaId");
  });

  it("dia sem expediente fica sem horários, sem erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => businessRule()),
    );
    expect(await api.availability.forAppointment({ appointment, date })).toEqual([]);
  });

  it("sem funcionária, não repete a chamada", async () => {
    const fetch = vi.fn().mockImplementation(async () => businessRule());
    vi.stubGlobal("fetch", fetch);
    await api.availability.forAppointment({ appointment: { ...appointment, staffId: null }, date });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("erro de servidor continua sendo erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => json(500, { mensagem: "falhou" })),
    );
    await expect(api.availability.forAppointment({ appointment, date })).rejects.toMatchObject({ status: 500 });
  });
});
