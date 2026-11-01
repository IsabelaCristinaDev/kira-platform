// Busca do app: texto, categoria, ordenação e favoritas · dados: mock · API: nenhuma (a lista vem de api.professionals)
import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export const defaultSearchFilters = { price: 500, minRating: 0, maxDistance: 30, mode: "ambos", sort: "proximo" };

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sort, setSort] = useState(defaultSearchFilters.sort);
  const [favoriteProIds, setFavoriteProIds] = useState([]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      categoryFilter,
      setCategoryFilter,
      sort,
      setSort,
      favoriteProIds,
      toggleFavoriteProfessional: (id) =>
        setFavoriteProIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])),
    }),
    [searchQuery, categoryFilter, sort, favoriteProIds],
  );
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch precisa estar dentro de <SearchProvider>");
  return ctx;
};
