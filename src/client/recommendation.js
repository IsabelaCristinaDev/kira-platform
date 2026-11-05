// Compatibilidade e TOP N de profissionais sobre a lista real do backend · função pura
import { matchesCategory } from "./utils/categories";

// Calcula um score de compatibilidade (0 a 1) entre um profissional e os
// critérios informados pela cliente. Ainda não há análise de imagem: a foto de
// referência do Provador só muda o peso do procedimento, e a similaridade
// visual entra aqui quando existir um serviço para isso.
export function scoreProfessional(pro, { service, category, referenceImage, priceRange } = {}) {
  const parts = [];
  const add = (weight, value) => parts.push([weight, value]);
  const rating = (pro.rating ?? 0) / 5;

  // Procedimento compatível: prioridade no ranking do Provador
  const procedureWeight = referenceImage ? 0.45 : 0.25;
  if (category && category !== "todos") add(procedureWeight, matchesCategory(pro, category) ? 1 : 0.1);
  else if (service) add(procedureWeight, matchesCategory(pro, service) ? 1 : 0.25);
  else add(procedureWeight, 0.6);

  add(referenceImage ? 0.25 : 0.35, rating);
  // Quantidade de avaliações, com saturação (só vem no detalhe; sem ela, neutro)
  add(0.15, pro.reviews != null ? Math.min(pro.reviews / 150, 1) : 0.5);
  if (pro.distance != null) add(0.15, Math.max(0, 1 - pro.distance / 10));
  if (priceRange?.max) add(0.1, pro.price != null && pro.price <= priceRange.max ? 1 : 0.2);

  const total = parts.reduce((s, [w]) => s + w, 0);
  const score = parts.reduce((s, [w, v]) => s + w * v, 0) / total;
  return Math.max(0, Math.min(1, score));
}

// Ordena os profissionais por compatibilidade (0–100) com os critérios da cliente.
// Se o filtro de categoria/preferências não encontrar ninguém, usa a lista toda.
export function recommendProfessionals(professionals, { preferences = [], minRating, limit = 3, ...criteria } = {}) {
  const { category } = criteria;
  let pool = professionals;
  if (category && category !== "todos") pool = pool.filter((p) => matchesCategory(p, category));
  else if (preferences.length > 0) pool = pool.filter((p) => preferences.some((c) => matchesCategory(p, c)));
  if (minRating) pool = pool.filter((p) => (p.rating ?? 0) >= minRating);
  const source = pool.length > 0 ? pool : professionals;

  return source
    .map((pro) => ({ ...pro, compatibility: Math.round(scoreProfessional(pro, criteria) * 100) }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
}
