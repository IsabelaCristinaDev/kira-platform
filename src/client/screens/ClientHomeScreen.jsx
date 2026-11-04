// Home: busca, categorias, mapa mock, próximas e TOP 3 recomendadas · mock
import { useState } from "react";
import { ChevronRight, MapPin, MessageCircle, Search, Sparkles, Star, User, Wand2 } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSearch } from "../../context/SearchContext";
import { useSession } from "../../context/SessionContext";
import { useRanking, useTryOn } from "../../context/TryOnContext";
import { useScheduling } from "../../context/SchedulingContext";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { CategoryChip } from "../../shared/components/ui";
import { mockProfessionals, nearbyProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { RecommendedProfessionalCard } from "../components/ProfessionalCards";
import { dashboardCategories } from "../data/mocks";

export default function ClientHomeScreen() {
  const { cForm } = useSignup();
  const { categoryFilter, setCategoryFilter } = useSearch();
  const { goToTab, setScreen } = useSession();
  const { loadRanking, rankingError, rankingLoading, recommended } = useRanking();
  const { rankingSource, startTryOnFlow } = useTryOn();
  const { setBookedSlot, setSelectedProId } = useScheduling();
  const [homeMapSelectedId, setHomeMapSelectedId] = useState(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia," : hour < 18 ? "Boa tarde," : "Boa noite,";
  const nearbyCount = mockProfessionals.filter((p) => p.distance <= 5).length;
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

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 var(--space-24) var(--space-24)" }}>
        <div
          className="k-hscroll"
          style={{ display: "flex", gap: "var(--space-8)", overflowX: "auto", padding: "0 0 var(--space-18)" }}
        >
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

        {/* Mapa/localização — representação visual local (mock), sem integração externa de mapas */}
        {(() => {
          const mapPros = [...mockProfessionals].sort((a, b) => a.distance - b.distance).slice(0, 4);
          const markerPositions = [
            { top: "26%", left: "20%" },
            { top: "55%", left: "46%" },
            { top: "36%", left: "72%" },
            { top: "70%", left: "82%" },
          ];
          const markerColors = [colors.primary, colors.accent, colors.secondary, colors.primary];
          const selectedPro = mapPros.find((p) => p.id === homeMapSelectedId);
          return (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 148,
                borderRadius: "var(--radius-4xl)",
                overflow: "hidden",
                marginBottom: "var(--space-22)",
                background: "linear-gradient(160deg, var(--color-surface-soft), var(--color-lilac))",
                border: `1px solid ${colors.border}`,
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 320 148"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0 }}
              >
                <line x1="0" y1="38" x2="320" y2="28" stroke={colors.border} strokeWidth="2" />
                <line x1="0" y1="95" x2="320" y2="112" stroke={colors.border} strokeWidth="2" />
                <line x1="60" y1="0" x2="90" y2="148" stroke={colors.border} strokeWidth="2" />
                <line x1="230" y1="0" x2="205" y2="148" stroke={colors.border} strokeWidth="2" />
              </svg>
              {mapPros.map((pro, i) => {
                const pos = markerPositions[i];
                const isSelected = homeMapSelectedId === pro.id;
                return (
                  <button
                    key={pro.id}
                    onClick={() => setHomeMapSelectedId((id) => (id === pro.id ? null : pro.id))}
                    aria-label={pro.name}
                    style={{
                      position: "absolute",
                      top: pos.top,
                      left: pos.left,
                      transform: "translate(-50%, -50%)",
                      width: isSelected ? 16 : 10,
                      height: isSelected ? 16 : 10,
                      borderRadius: "var(--radius-round)",
                      background: markerColors[i],
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? `0 0 0 5px hsl(var(--primary-hsl) / 0.25)`
                        : "0 0 0 4px hsl(var(--white-hsl) / 0.65)",
                      transition: "width 0.15s ease, height 0.15s ease",
                    }}
                  />
                );
              })}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-6)",
                  padding: "var(--space-6) var(--space-12)",
                  borderRadius: "var(--radius-pill)",
                  background: colors.card,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <MapPin size={13} color={colors.primary} />
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: colors.foreground,
                  }}
                >
                  {nearbyCount} perto de você
                </span>
              </div>
              {selectedPro && (
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-10)",
                    padding: "var(--space-8)",
                    borderRadius: "var(--radius-xl)",
                    background: colors.card,
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <img
                    src={selectedPro.photo}
                    alt={selectedPro.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontWeight: 700,
                        fontSize: "var(--font-size-xs)",
                        color: colors.foreground,
                        margin: 0,
                      }}
                    >
                      {selectedPro.name}
                    </p>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-6)",
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                      }}
                    >
                      <Star size={10} color={colors.accent} fill={colors.accent} /> {selectedPro.rating}{" "}
                      <MapPin size={10} /> {selectedPro.distance} km
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProId(selectedPro.id);
                      setBookedSlot(null);
                      setScreen("clientProfessionalProfile");
                    }}
                    style={{
                      padding: "var(--space-6) var(--space-12)",
                      borderRadius: "var(--radius-pill)",
                      border: "none",
                      background: gradientKira,
                      color: colors.primaryForeground,
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 700,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    Ver perfil
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-base)",
            color: colors.foreground,
            margin: "0 0 var(--space-12)",
          }}
        >
          Profissionais perto de você
        </h2>
        {(() => {
          const recommendedTop5 = recommended.slice(0, 3);
          const recommendedIds = new Set(recommendedTop5.map((p) => p.id));
          const nearbyDeduped = nearbyProfessionals.filter((p) => !recommendedIds.has(p.id));
          const isPersonalizedHome = rankingSource === "provador";
          return (
            <>
              <div
                className="k-hscroll"
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
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      style={{ width: "100%", height: 84, borderRadius: "var(--radius-lg)", objectFit: "cover" }}
                    />
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
                          <Star size={10} color={colors.accent} fill={colors.accent} /> {pro.rating}
                        </span>
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
                          <MapPin size={10} /> {pro.distance}
                        </span>
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
                  : "Selecionadas para você com base em avaliação e proximidade."}
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
        <button
          type="button"
          onClick={() => setScreen("clientChat")}
          aria-label="Ajuda: conversar com o atendimento Kira"
          style={{
            position: "sticky",
            bottom: "var(--space-16)",
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
            minHeight: 48,
            padding: "0 var(--space-18)",
            borderRadius: "var(--radius-pill)",
            border: "none",
            background: gradientKira,
            color: colors.primaryForeground,
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: "var(--font-size-sm)",
            boxShadow: "var(--shadow-md)",
            cursor: "pointer",
          }}
        >
          <MessageCircle size={18} aria-hidden="true" /> Ajuda
        </button>
      </div>

      <BottomNav active="clientHome" onNavigate={goToTab} />
    </div>
  );
}
