// Métricas do painel do profissional calculadas a partir dos agendamentos do backend · funções puras
// Cada agendamento chega com `price` (do serviço) já preenchido por useBusinessData.

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const DAY = 86400000;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
// Segunda-feira da semana de `d`
export const startOfWeek = (d) => {
  const day = startOfDay(d);
  return new Date(day.getTime() - ((day.getDay() + 6) % 7) * DAY);
};
const weekdayIndex = (d) => (d.getDay() + 6) % 7;
const sum = (list) => list.reduce((s, a) => s + (a.price ?? 0), 0);
const between = (a, from, to) => a.start >= from && a.start < to;

export const completed = (list) => list.filter((a) => a.rawStatus === "CONCLUIDO");

export const weeklyRevenue = (list, now = new Date()) => {
  const monday = startOfWeek(now);
  const done = completed(list);
  return WEEKDAYS.map((label, i) => {
    const from = new Date(monday.getTime() + i * DAY);
    const to = new Date(from.getTime() + DAY);
    return { label, value: sum(done.filter((a) => between(a, from, to))) };
  });
};

export const monthlyRevenue = (list, now = new Date()) => {
  const done = completed(list).filter(
    (a) => a.start.getFullYear() === now.getFullYear() && a.start.getMonth() === now.getMonth(),
  );
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: Math.ceil(lastDay / 7) }, (_, i) => ({
    label: `S${i + 1}`,
    value: sum(done.filter((a) => Math.floor((a.start.getDate() - 1) / 7) === i)),
  }));
};

// Variação % do faturamento desta semana contra a anterior (null sem base de comparação)
export const revenueDelta = (list, now = new Date()) => {
  const monday = startOfWeek(now);
  const done = completed(list);
  const current = sum(done.filter((a) => between(a, monday, new Date(monday.getTime() + 7 * DAY))));
  const previous = sum(done.filter((a) => between(a, new Date(monday.getTime() - 7 * DAY), monday)));
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;
};

export const appointmentsOn = (list, date) => {
  const from = startOfDay(date);
  const to = new Date(from.getTime() + DAY);
  return list.filter((a) => between(a, from, to) && a.rawStatus !== "CANCELADO");
};

export const upcoming = (list, now = new Date(), limit = 3) =>
  list
    .filter((a) => a.status === "proximo" && a.start >= now)
    .sort((a, b) => a.start - b.start)
    .slice(0, limit);

export const averageRating = (reviews) =>
  reviews.length === 0 ? null : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

export const analyticsSummary = (list) => {
  const done = completed(list);
  const cancelled = list.filter((a) => a.rawStatus === "CANCELADO").length;
  const visits = new Map();
  done.forEach((a) => visits.set(a.clientId, (visits.get(a.clientId) ?? 0) + 1));
  const returning = [...visits.values()].filter((n) => n >= 2).length;
  return {
    avgTicket: done.length ? Math.round(sum(done) / done.length) : 0,
    retentionRate: visits.size ? Math.round((returning / visits.size) * 100) : 0,
    completionRate: done.length + cancelled ? Math.round((done.length / (done.length + cancelled)) * 100) : 0,
  };
};

export const appointmentsByWeekday = (list) => {
  const done = completed(list);
  return WEEKDAYS.map((label, i) => ({ label, value: done.filter((a) => weekdayIndex(a.start) === i).length }));
};

// Serviços mais feitos, cada um com os clientes que o fizeram
export const serviceRanking = (list) => {
  const byService = new Map();
  completed(list).forEach((a) => {
    const entry = byService.get(a.service) ?? { service: a.service, count: 0, revenue: 0, appointments: [] };
    entry.count += 1;
    entry.revenue += a.price ?? 0;
    entry.appointments.push(a);
    byService.set(a.service, entry);
  });
  return [...byService.values()].sort((a, b) => b.count - a.count);
};

export const serviceClientBreakdown = (entry) => {
  const byClient = new Map();
  entry.appointments.forEach((a) => {
    const c = byClient.get(a.clientId) ?? { name: a.clientName, visits: 0, totalSpent: 0, last: a.start };
    c.visits += 1;
    c.totalSpent += a.price ?? 0;
    if (a.start > c.last) c.last = a.start;
    byClient.set(a.clientId, c);
  });
  return [...byClient.values()]
    .map((c) => ({ ...c, lastDate: c.last.toLocaleDateString("pt-BR") }))
    .sort((a, b) => b.visits - a.visits || b.last - a.last);
};

export const ratingBreakdown = (reviews) =>
  [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percent: reviews.length ? Math.round((reviews.filter((r) => r.rating === stars).length / reviews.length) * 100) : 0,
  }));
