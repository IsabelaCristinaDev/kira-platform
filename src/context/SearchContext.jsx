// Busca: texto, categoria, filtros aplicados e favoritas · API: kira-backend (favoritas, em api.favorites; a lista vem de api.professionals)
import { createContext, useContext, useState } from "react";
import { defaultSearchFilters } from "../client/data/options";
import { useFavorites } from "../client/hooks/useFavorites";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [appliedFilters, setAppliedFilters] = useState(defaultSearchFilters);
  const { favoriteProIds, toggleFavoriteProfessional } = useFavorites();

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
