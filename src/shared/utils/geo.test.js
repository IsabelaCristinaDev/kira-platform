// Testes da distância entre dois pontos · API: nenhuma
import { describe, expect, it } from "vitest";
import { distanceKm } from "./geo";

const goiania = { latitude: -16.6869, longitude: -49.2648 };
const anapolis = { latitude: -16.3281, longitude: -48.953 };

describe("distanceKm", () => {
  it("calcula a distância em km", () => {
    const d = distanceKm(goiania, anapolis);
    expect(d).toBeGreaterThan(50);
    expect(d).toBeLessThan(55);
  });
  it("o mesmo ponto dá zero, inclusive na coordenada 0", () => {
    expect(distanceKm(goiania, goiania)).toBe(0);
    expect(distanceKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 })).toBe(0);
  });
  it("sem coordenada de um dos lados, não há distância", () => {
    expect(distanceKm(goiania, { latitude: null, longitude: null })).toBeNull();
    expect(distanceKm(null, goiania)).toBeNull();
  });
});
