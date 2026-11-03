// Busca: texto, categoria, filtros aplicados e favoritas · API: nenhuma (a lista vem de api.professionals)
import { createContext, useContext, useState } from "react";
import { defaultSearchFilters } from "../client/data/options";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [appliedFilters, setAppliedFilters] = useState(defaultSearchFilters);
  const [favoriteProIds, setFavoriteProIds] = useState([]);

  const toggleFavoriteProfessional = (id) =>
    setFavoriteProIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const value = {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    appliedFilters,
    setAppliedFilters,
    favoriteProIds,
    toggleFavoriteProfessional,
  };
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch precisa estar dentro de <SearchProvider>");
  return ctx;
};
