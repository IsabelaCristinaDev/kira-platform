// Testes das métricas do painel do profissional
import { describe, expect, it } from "vitest";
import {
  analyticsSummary,
  appointmentsOn,
  averageRating,
  monthlyRevenue,
  ratingBreakdown,
  revenueDelta,
  serviceClientBreakdown,
  serviceRanking,
  upcoming,
  weeklyRevenue,
} from "./metrics";

// quinta-feira, 15/10/2026
const now = new Date(2026, 9, 15, 12, 0);
const ap = (id, day, rawStatus, price, extra = {}) => ({
  id,
  start: new Date(2026, 9, day, 10, 0),
  rawStatus,
  status: { CONCLUIDO: "concluido", CANCELADO: "cancelado" }[rawStatus] ?? "proximo",
  price,
  service: "Corte",
  clientId: "c1",
  clientName: "Ana",
  ...extra,
});

const list = [
  ap("1", 12, "CONCLUIDO", 80), // segunda desta semana
  ap("2", 15, "CONCLUIDO", 50, { service: "Escova", clientId: "c2", clientName: "Bia" }),
  ap("3", 15, "CANCELADO", 80),
  ap("4", 16, "CONFIRMADO", 80),
  ap("5", 6, "CONCLUIDO", 100), // terça da semana passada
];

describe("faturamento", () => {
  it("soma só concluídos, por dia da semana atual", () => {
    const week = weeklyRevenue(list, now);
    expect(week.map((d) => d.value)).toEqual([80, 0, 0, 50, 0, 0, 0]);
  });
  it("agrupa o mês em semanas", () => {
    const month = monthlyRevenue(list, now);
    expect(month[0].value).toBe(100);
    expect(month[1].value).toBe(80);
    expect(month[2].value).toBe(50);
    expect(month).toHaveLength(5);
  });
  it("compara com a semana anterior", () => {
    expect(revenueDelta(list, now)).toBe(30);
    expect(revenueDelta([], now)).toBeNull();
  });
});

describe("agenda", () => {
  it("lista o dia sem os cancelados", () => {
    expect(appointmentsOn(list, now).map((a) => a.id)).toEqual(["2"]);
  });
  it("próximos atendimentos a partir de agora", () => {
    expect(upcoming(list, now).map((a) => a.id)).toEqual(["4"]);
  });
});

describe("analytics", () => {
  it("resume ticket, retorno e conclusão", () => {
    expect(analyticsSummary(list)).toEqual({ avgTicket: 77, retentionRate: 50, completionRate: 75 });
  });
  it("ranqueia serviços e detalha clientes", () => {
    const ranking = serviceRanking(list);
    expect(ranking.map((s) => [s.service, s.count, s.revenue])).toEqual([
      ["Corte", 2, 180],
      ["Escova", 1, 50],
    ]);
    expect(serviceClientBreakdown(ranking[0])).toMatchObject([{ name: "Ana", visits: 2, totalSpent: 180 }]);
  });
  it("calcula nota média e distribuição", () => {
    const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 5 }];
    expect(averageRating(reviews)).toBe(4.7);
    expect(averageRating([])).toBeNull();
    expect(ratingBreakdown(reviews).map((r) => r.percent)).toEqual([67, 33, 0, 0, 0]);
  });
});
