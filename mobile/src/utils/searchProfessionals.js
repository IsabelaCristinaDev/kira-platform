// Filtra e ordena os profissionais de exemplo do app (serviços como texto, categoria própria) · função pura · sem API
export function searchProfessionals(professionals, { query, category, filters }) {
  const q = query.trim().toLowerCase();
  return professionals
    .filter((p) => {
      if (category !== "todos" && p.category !== category) return false;
      if (q && q !== "erro") {
        const haystack = `${p.name} ${p.role} ${p.category} ${p.services.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (p.price > filters.price) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (p.distance > filters.maxDistance) return false;
      if (filters.mode !== "ambos" && p.mode !== "ambos" && p.mode !== filters.mode) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "avaliado") return b.rating - a.rating;
      if (filters.sort === "preco") return a.price - b.price;
      if (filters.sort === "recomendado") return b.reviews - a.reviews;
      return a.distance - b.distance;
    });
}
