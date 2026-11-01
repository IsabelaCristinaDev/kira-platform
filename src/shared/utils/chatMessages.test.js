// Testes do agrupamento de mensagens por dia e dos rótulos de dia e hora · API: nenhuma
import { describe, expect, it } from "vitest";
import { dayLabel, formatTime, groupMessagesByDay, mergeMessage, totalUnread } from "./chatMessages";

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

describe("mergeMessage", () => {
  const msg = (id, createdAt) => ({ id, createdAt: new Date(createdAt) });

  it("acrescenta a mensagem nova na ordem de envio", () => {
    const list = [msg("a", "2026-11-01T10:00:00"), msg("c", "2026-11-01T12:00:00")];
    expect(mergeMessage(list, msg("b", "2026-11-01T11:00:00")).map((m) => m.id)).toEqual(["a", "b", "c"]);
  });

  it("não repete a mensagem que chega pelo envio e pelo tempo real", () => {
    const list = [msg("a", "2026-11-01T10:00:00")];
    expect(mergeMessage(list, msg("a", "2026-11-01T10:00:00"))).toHaveLength(1);
  });
});

describe("totalUnread", () => {
  it("soma as não lidas de todas as conversas", () => {
    expect(totalUnread([{ unread: 2 }, { unread: 0 }, { unread: 1 }])).toBe(3);
  });
  it("sem conversas, é zero", () => {
    expect(totalUnread([])).toBe(0);
  });
});
