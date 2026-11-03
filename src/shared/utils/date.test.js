// Testes das datas auxiliares · API: nenhuma
import { describe, expect, it } from "vitest";
import { startOfDay, startOfMonth } from "./date";

describe("datas auxiliares", () => {
  it("startOfMonth volta ao dia 1", () => {
    expect(startOfMonth(new Date(2026, 9, 14, 15, 30)).getDate()).toBe(1);
  });
  it("startOfDay zera a hora", () => {
    const d = startOfDay(new Date(2026, 9, 14, 15, 30));
    expect([d.getHours(), d.getMinutes()]).toEqual([0, 0]);
  });
});
