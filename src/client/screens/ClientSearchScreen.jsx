// Busca com filtros, scroll infinito e pull-to-refresh · API: kira-backend (estúdios)
import { Loader2 } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useSession } from "../../context/SessionContext";
import { useScheduling } from "../../context/SchedulingContext";
import { EmptyState, ErrorState, SkeletonLoading } from "../../shared/components/states";
import { CategoryChip, Header, SearchBar } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { FilterModal } from "../components/FilterModal";
import { ProfessionalCard } from "../components/ProfessionalCards";
import { useSearchScreen } from "../hooks/useSearchScreen";
import { categoryOptions } from "../data/options";

export default function ClientSearchScreen() {
  const { categoryFilter, searchQuery, setCategoryFilter, setSearchQuery } = useSearch();
  const { goToTab, setScreen } = useSession();
  const { setBookedSlot, setSelectedProId } = useScheduling();
  const search = useSearchScreen();
  const {
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
  } = search;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ padding: "0 var(--space-24) var(--space-12)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "0 0 var(--space-14)",
          }}
        >
          Buscar
        </h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onFilterClick={openFilterModal} />
        <div
          style={{
            display: "flex",
            gap: "var(--space-8)",
            overflowX: "auto",
            padding: "var(--space-14) 0 var(--space-4)",
          }}
        >
          {categoryOptions.map((c) => (
            <CategoryChip
              key={c.id}
              label={c.label}
              active={categoryFilter === c.id}
              onClick={() => setCategoryFilter(c.id)}
            />
          ))}
        </div>
      </div>

      <div
        ref={searchListRef}
        onScroll={handleSearchScroll}
        onTouchStart={handlePullStart}
        onTouchMove={handlePullMove}
        onTouchEnd={handlePullEnd}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--space-8) var(--space-24) var(--space-24)",
          position: "relative",
        }}
      >
        {(pullDistance > 0 || refreshing) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "var(--space-8)",
              height: refreshing ? 32 : pullDistance,
            }}
          >
            <Loader2
              size={18}
              color={colors.primary}
              className={refreshing ? "spin" : ""}
              style={{ opacity: refreshing ? 1 : Math.min(pullDistance / 55, 1) }}
            />
          </div>
        )}

        {searchLoading ? (
          <SkeletonLoading count={6} />
        ) : searchHasError ? (
          <ErrorState onRetry={runSearchLoad} />
        ) : filteredProfessionals.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
              {filteredProfessionals.slice(0, visibleCount).map((pro) => (
                <ProfessionalCard
                  key={pro.id}
                  pro={pro}
                  onClick={() => {
                    setSelectedProId(pro.id);
                    setBookedSlot(null);
                    setScreen("clientProfessionalProfile");
                  }}
                />
              ))}
            </div>
            {visibleCount < filteredProfessionals.length && (
              <p
                style={{
                  textAlign: "center",
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  margin: "var(--space-14) 0 0",
                }}
              >
                Carregando mais…
              </p>
            )}
          </>
        )}
      </div>

      <BottomNav active="clientSearch" onNavigate={goToTab} />
      <FilterModal
        open={filterModalOpen}
        mounted={filterModalMounted}
        onClose={closeFilterModal}
        draft={draftFilters}
        setDraft={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}
