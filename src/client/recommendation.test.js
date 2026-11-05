// Testes de compatibilidade e ranking de profissionais
import { describe, expect, it } from "vitest";
import { professionals } from "../test/professionals";
import { recommendProfessionals, scoreProfessional } from "./recommendation";

describe("scoreProfessional", () => {
  it("devolve valor entre 0 e 1", () => {
    for (const pro of professionals) {
      for (const opts of [{}, { category: "cabelo" }, { referenceImage: "x", category: "cabelo" }]) {
        const s = scoreProfessional(pro, opts);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
      }
    }
  });
  it("com foto de referência, a categoria certa pontua mais que a errada", () => {
    const opts = { referenceImage: "x", category: "cabelo" };
    const cabelo = professionals[0];
    const unhas = { ...professionals[2], rating: cabelo.rating };
    expect(scoreProfessional(cabelo, opts)).toBeGreaterThan(scoreProfessional(unhas, opts));
  });
});

describe("recommendProfessionals", () => {
  it("devolve 3 por padrão, ordenados pela compatibilidade (0 a 100)", () => {
    const list = recommendProfessionals(professionals);
    expect(list).toHaveLength(3);
    const scores = list.map((p) => p.compatibility);
    expect(scores.every((s) => s >= 0 && s <= 100)).toBe(true);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
  it("respeita o limite informado", () => {
    expect(recommendProfessionals(professionals, { limit: 5 })).toHaveLength(5);
  });
  it("filtra pela categoria e pelas preferências", () => {
    expect(recommendProfessionals(professionals, { category: "unhas", limit: 10 }).map((p) => p.id)).toEqual(["c"]);
    const prefs = recommendProfessionals(professionals, { preferences: ["cabelo", "barbearia"], limit: 10 });
    expect(prefs.map((p) => p.id).sort()).toEqual(["a", "b"]);
  });
  it("usa a lista toda quando o filtro não encontra ninguém", () => {
    expect(recommendProfessionals(professionals, { minRating: 6 })).toHaveLength(3);
  });
  it("lista vazia devolve vazio", () => {
    expect(recommendProfessionals([])).toEqual([]);
  });
});
