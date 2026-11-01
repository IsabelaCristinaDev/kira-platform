// Testes do adaptador mock da API (latência, erro simulado e formato das respostas) · API: nenhuma
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockProfessionals } from "../data/professionals";
import { ApiError } from "./contract";
import { mockAdapter } from "./mockAdapter";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const settle = async (promise, ms) => {
  const result = promise.then(
    (value) => ({ value }),
    (error) => ({ error }),
  );
  await vi.advanceTimersByTimeAsync(ms);
  return result;
};

describe("mockAdapter", () => {
  it("lista os profissionais depois da latência", async () => {
    const { value } = await settle(mockAdapter.professionals.list(), 650);
    expect(value).toBe(mockProfessionals);
  });

  it("disponibilidade falha na primeira tentativa dos dias múltiplos de 13 e passa na repetição", async () => {
    const date = new Date(2026, 9, 13);
    const pro = mockProfessionals[0];
    const first = await settle(mockAdapter.availability.get({ pro, date }), 500);
    expect(first.error).toBeInstanceOf(ApiError);
    const retry = await settle(mockAdapter.availability.get({ pro, date, retried: true }), 500);
    expect(retry.value.length).toBeGreaterThan(0);
  });

  it("disponibilidade de um dia normal devolve horários", async () => {
    const { value } = await settle(
      mockAdapter.availability.get({ pro: mockProfessionals[0], date: new Date(2026, 9, 14) }),
      500,
    );
    expect(value.length).toBeGreaterThanOrEqual(3);
  });

  it("recomendações respeitam o limite", async () => {
    const { value } = await settle(mockAdapter.recommendations.get({ limit: 5 }), 550);
    expect(value).toHaveLength(5);
  });

  it("busca de CEP devolve o endereço", async () => {
    const { value } = await settle(mockAdapter.address.lookupCep("74000000"), 500);
    expect(value.state).toBe("GO");
  });

  it("salvar perfil devolve ok", async () => {
    const { value } = await settle(mockAdapter.profile.save({}), 700);
    expect(value).toEqual({ ok: true });
  });
});
