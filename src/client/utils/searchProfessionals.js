// Filtra e ordena profissionais pela busca, categoria e filtros aplicados · função pura
import { matchesCategory, professionalText } from "./categories";

// Campos que o backend ainda não devolve (distância, modo de atendimento) não filtram ninguém
export function searchProfessionals(professionals, { query, category, filters }) {
  const q = query.trim().toLowerCase();
  const byRating = (a, b) => (b.rating ?? 0) - (a.rating ?? 0);
  return professionals
    .filter((p) => {
      if (!matchesCategory(p, category)) return false;
      if (q && !professionalText(p).includes(q)) return false;
      if (p.price != null && p.price > filters.price) return false;
      if (filters.minRating > 0 && (p.rating ?? 0) < filters.minRating) return false;
      if (p.distance != null && p.distance > filters.maxDistance) return false;
      if (filters.mode !== "ambos" && p.mode && p.mode !== "ambos" && p.mode !== filters.mode) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "avaliado") return byRating(a, b);
      if (filters.sort === "preco") return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (filters.sort === "recomendado") return (b.reviews ?? 0) - (a.reviews ?? 0) || byRating(a, b);
      if (a.distance != null && b.distance != null) return a.distance - b.distance;
      return byRating(a, b);
    });
}
