// Estado da tela de busca (carregamento, filtros, rolagem infinita, puxar para atualizar) · API: kira-backend (estúdios)
import { useEffect, useRef, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { defaultSearchFilters } from "../data/options";
import { searchProfessionals } from "../utils/searchProfessionals";
import { useProfessionals } from "./useProfessionals";

const PAGE_SIZE = 8;

export function useSearchScreen() {
  const { searchQuery, categoryFilter, setCategoryFilter, appliedFilters, setAppliedFilters } = useSearch();
  const [draftFilters, setDraftFilters] = useState(defaultSearchFilters);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterModalMounted, setFilterModalMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const searchListRef = useRef(null);
  const pullStartY = useRef(null);

  // a lista vem do backend; a busca e os filtros são aplicados aqui, sem novo carregamento
  const load = useProfessionals();
  const searchLoading = load.isFetching;

  const filteredProfessionals = searchProfessionals(load.data ?? [], {
    query: searchQuery,
    category: categoryFilter,
    filters: appliedFilters,
  });
  const searchHasError = load.isError && !load.isFetching;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, categoryFilter, appliedFilters]);

  const runSearchLoad = () => {
    setVisibleCount(PAGE_SIZE);
    load.refetch();
  };
  const openFilterModal = () => {
    setDraftFilters(appliedFilters);
    setFilterModalOpen(true);
    setTimeout(() => setFilterModalMounted(true), 10);
  };
  const closeFilterModal = () => {
    setFilterModalMounted(false);
    setTimeout(() => setFilterModalOpen(false), 200);
  };
  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    closeFilterModal();
  };
  const clearFilters = () => {
    setDraftFilters(defaultSearchFilters);
    setAppliedFilters(defaultSearchFilters);
    setCategoryFilter("todos");
    closeFilterModal();
  };
  const handleSearchScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      setVisibleCount((v) => Math.min(v + PAGE_SIZE, filteredProfessionals.length));
    }
  };
  const handlePullStart = (e) => {
    if (searchListRef.current && searchListRef.current.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const handlePullMove = (e) => {
    if (pullStartY.current === null) return;
    const diff = e.touches[0].clientY - pullStartY.current;
    if (diff > 0) setPullDistance(Math.min(diff, 80));
  };
  const handlePullEnd = () => {
    if (pullDistance > 55) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        runSearchLoad();
      }, 600);
    }
    setPullDistance(0);
    pullStartY.current = null;
  };

  return {
    applyFilters,
    clearFilters,
    closeFilterModal,
    draftFilters,
    filterModalMounted,
    filterModalOpen,
    filteredProfessionals,
    handlePullEnd,
    handlePullMove,
    handlePullStart,
    handleSearchScroll,
    openFilterModal,
    pullDistance,
    refreshing,
    runSearchLoad,
    searchHasError,
    searchListRef,
    searchLoading,
    setDraftFilters,
    visibleCount,
  };
}
