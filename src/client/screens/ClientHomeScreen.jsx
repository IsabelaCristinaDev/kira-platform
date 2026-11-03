// Home: busca, categorias, profissionais e TOP 3 recomendadas · API: kira-backend (estúdios)
import { ChevronRight, MapPin, Search, Sparkles, Star, User, Wand2 } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSearch } from "../../context/SearchContext";
import { useSession } from "../../context/SessionContext";
import { useRanking, useTryOn } from "../../context/TryOnContext";
import { useScheduling } from "../../context/SchedulingContext";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { CategoryChip } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { ProPhoto, RecommendedProfessionalCard, ratingLabel } from "../components/ProfessionalCards";
import { dashboardCategories } from "../data/options";
import { useProfessionals } from "../hooks/useProfessionals";

export default function ClientHomeScreen() {
  const { cForm } = useSignup();
  const { categoryFilter, setCategoryFilter } = useSearch();
  const { goToTab, setScreen } = useSession();
  const { loadRanking, rankingError, rankingLoading, recommended } = useRanking();
  const { rankingSource, startTryOnFlow } = useTryOn();
  const { setBookedSlot, setSelectedProId } = useScheduling();
  const professionals = useProfessionals();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia," : hour < 18 ? "Boa tarde," : "Boa noite,";
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "var(--space-20) var(--space-24) var(--space-4)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "var(--space-18)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              {greeting}
            </p>
            <h1
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-xl)",
                color: colors.foreground,
                margin: "var(--space-2) 0 0",
              }}
            >
              Olá, {cForm.name ? cForm.name.split(" ")[0] : "bem-vinda"}{" "}
              <Sparkles size={15} style={{ display: "inline", verticalAlign: "middle", color: colors.primaryText }} />
            </h1>
          </div>
          <button
            onClick={() => setScreen("clientProfile")}
            aria-label="Meu perfil"
            style={{
              width: 42,
              height: 42,
              borderRadius: "var(--radius-round)",
              overflow: "hidden",
              border: `2px solid ${colors.border}`,
              background: colors.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              padding: 0,
            }}
          >
            {cForm.photo ? (
              <img
                src={cForm.photo}
                alt="Foto de perfil"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={18} color={colors.mutedForeground} />
            )}
          </button>
        </div>

        <button
          type="button"
          className="k-reset"
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-10)",
            background: colors.muted,
            borderRadius: "var(--radius-pill)",
            padding: "var(--space-12) var(--space-16)",
            cursor: "pointer",
            marginBottom: "var(--space-16)",
          }}
          onClick={() => setScreen("clientSearch")}
        >
          <Search size={16} color={colors.mutedForeground} />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.mutedForeground,
            }}
          >
            Buscar profissional ou serviço
          </span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 var(--space-24) var(--space-24)" }}>
        <div style={{ display: "flex", gap: "var(--space-8)", overflowX: "auto", padding: "0 0 var(--space-18)" }}>
          {dashboardCategories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              active={categoryFilter === cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                setScreen("clientSearch");
              }}
            />
          ))}
        </div>

        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-base)",
            color: colors.foreground,
            margin: "0 0 var(--space-12)",
          }}
        >
          Profissionais na Kira
        </h2>
        {(() => {
          const recommendedTop5 = recommended.slice(0, 3);
          const recommendedIds = new Set(recommendedTop5.map((p) => p.id));
          const nearbyDeduped = (professionals.data ?? []).filter((p) => !recommendedIds.has(p.id)).slice(0, 8);
          const isPersonalizedHome = rankingSource === "provador";
          return (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-10)",
                  overflowX: "auto",
                  paddingBottom: "var(--space-4)",
                  marginBottom: "var(--space-24)",
                }}
              >
                {nearbyDeduped.map((pro) => (
                  <button
                    key={pro.id}
                    onClick={() => {
                      setSelectedProId(pro.id);
                      setBookedSlot(null);
                      setScreen("clientProfessionalProfile");
                    }}
                    style={{
                      flexShrink: 0,
                      width: 148,
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-8)",
                      padding: "var(--space-12)",
                      borderRadius: "var(--radius-2xl)",
                      border: `1px solid ${colors.border}`,
                      background: colors.card,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <ProPhoto pro={pro} size="100%" radius="var(--radius-lg)" style={{ height: 84 }} />
                    <div>
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontWeight: 700,
                          fontSize: "var(--font-size-xs)",
                          color: colors.foreground,
                          margin: 0,
                        }}
                      >
                        {pro.name}
                      </p>
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontSize: "var(--font-size-xs)",
                          color: colors.mutedForeground,
                          margin: "var(--space-1) 0 var(--space-4)",
                        }}
                      >
                        {pro.role}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            fontFamily: fontBody,
                            fontSize: "var(--font-size-xs)",
                            color: colors.mutedForeground,
                          }}
                        >
                          <Star size={10} color={colors.accent} fill={colors.accent} /> {ratingLabel(pro)}
                        </span>
                        {pro.city && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--space-2)",
                              fontFamily: fontBody,
                              fontSize: "var(--font-size-xs)",
                              color: colors.mutedForeground,
                            }}
                          >
                            <MapPin size={10} /> {pro.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <h2
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: "var(--font-size-base)",
                  color: colors.foreground,
                  margin: "0 0 var(--space-4)",
                }}
              >
                ✨ Recomendadas para você
              </h2>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  margin: "0 0 var(--space-14)",
                }}
              >
                {isPersonalizedHome
                  ? "Encontramos profissionais que combinam com o visual que você escolheu."
                  : "Selecionadas para você com base nas suas preferências e nas avaliações."}
              </p>
              {rankingLoading ? (
                <SkeletonLoading count={3} />
              ) : rankingError ? (
                <ErrorState onRetry={loadRanking} message="Não foi possível carregar as recomendações." />
              ) : recommendedTop5.length === 0 ? (
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                    margin: "var(--space-12) 0 var(--space-24)",
                    textAlign: "center",
                  }}
                >
                  Nenhuma recomendação disponível no momento.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-12)",
                    marginBottom: "var(--space-24)",
                  }}
                >
                  {recommendedTop5.map((pro) => (
                    <RecommendedProfessionalCard
                      key={pro.id}
                      pro={pro}
                      onViewProfile={() => {
                        setSelectedProId(pro.id);
                        setBookedSlot(null);
                        setScreen("clientProfessionalProfile");
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()}

        <button
          onClick={startTryOnFlow}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-12)",
            padding: "var(--space-16)",
            borderRadius: "var(--radius-3xl)",
            border: "none",
            background: "hsl(var(--primary-hsl) / 0.08)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-lg)",
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Wand2 size={20} color={colors.primaryForeground} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "var(--font-size-sm)",
                color: colors.foreground,
                margin: 0,
              }}
            >
              Provador virtual
            </p>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                margin: "var(--space-1) 0 0",
              }}
            >
              Veja como um visual fica em você antes de agendar
            </p>
          </div>
          <ChevronRight size={18} color={colors.primary} />
        </button>
      </div>

      <BottomNav active="clientHome" onNavigate={goToTab} />
    </div>
  );
}
