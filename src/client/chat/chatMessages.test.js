// Testes do agrupamento de mensagens por dia e dos rótulos de dia e hora · API: nenhuma
import { describe, expect, it } from "vitest";
import { dayLabel, formatTime, groupMessagesByDay } from "./chatMessages";

const now = new Date(2026, 9, 26, 15, 0);
const at = (day, hour, minute = 0) => new Date(2026, 9, day, hour, minute).toISOString();
const msg = (id, createdAt) => ({ id, type: "text", author: "user", text: id, createdAt });

describe("dayLabel", () => {
  it("usa Hoje, Ontem e a data completa", () => {
    expect(dayLabel(at(26, 8), now)).toBe("Hoje");
    expect(dayLabel(at(25, 23, 59), now)).toBe("Ontem");
    expect(dayLabel(at(20, 12), now)).toBe("20/10/2026");
  });
});

describe("formatTime", () => {
  it("mostra hora e minuto com dois dígitos", () => {
    expect(formatTime(at(26, 9, 5))).toBe("09:05");
  });
});

describe("groupMessagesByDay", () => {
  it("junta mensagens do mesmo dia e separa os dias na ordem", () => {
    const groups = groupMessagesByDay(
      [msg("a", at(24, 10)), msg("b", at(25, 9)), msg("c", at(25, 18)), msg("d", at(26, 8))],
      now,
    );
    expect(groups.map((g) => [g.label, g.messages.map((m) => m.id)])).toEqual([
      ["24/10/2026", ["a"]],
      ["Ontem", ["b", "c"]],
      ["Hoje", ["d"]],
    ]);
  });
  it("devolve lista vazia sem mensagens e chaves únicas por grupo", () => {
    expect(groupMessagesByDay([], now)).toEqual([]);
    const groups = groupMessagesByDay([msg("a", at(25, 9)), msg("b", at(26, 9))], now);
    expect(new Set(groups.map((g) => g.key)).size).toBe(2);
  });
});
