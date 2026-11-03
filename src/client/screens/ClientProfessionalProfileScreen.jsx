// Perfil da profissional (serviços, avaliações, endereço) · API: kira-backend (estúdio, serviços e avaliações)
import { ArrowLeft, Bookmark, MapPin } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { ProPhoto, RatingStars, ratingLabel } from "../components/ProfessionalCards";
import { useProfessional } from "../hooks/useProfessionals";

export default function ClientProfessionalProfileScreen() {
  const { favoriteProIds, toggleFavoriteProfessional } = useSearch();
  const { selectedProId, resetScheduling } = useScheduling();
  const { setScreen } = useSession();
  const query = useProfessional(selectedProId);
  const goToScheduling = () => {
    resetScheduling();
    setScreen("clientScheduling");
  };
  if (!query.data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientSearch")} />
        <div style={{ padding: "0 var(--space-24) var(--space-24)" }}>
          {!selectedProId ? (
            <ErrorState onRetry={() => setScreen("clientSearch")} message="Escolha um profissional na busca." />
          ) : query.isError ? (
            <ErrorState onRetry={query.refetch} message="Não foi possível carregar este perfil." />
          ) : (
            <SkeletonLoading count={3} />
          )}
        </div>
      </div>
    );
  }
  const pro = query.data;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ position: "relative", height: 140, background: gradientKira, flexShrink: 0 }}>
          <button
            onClick={() => setScreen("clientSearch")}
            aria-label="Voltar"
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              width: 34,
              height: 34,
              borderRadius: "var(--radius-round)",
              border: "none",
              background: "hsl(var(--white-hsl) / 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={20} color={colors.primaryForeground} />
          </button>
          <button
            onClick={() => toggleFavoriteProfessional(pro.id)}
            aria-label={favoriteProIds.includes(pro.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 34,
              height: 34,
              borderRadius: "var(--radius-round)",
              border: "none",
              background: "hsl(var(--white-hsl) / 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Bookmark
              size={17}
              color={colors.primaryForeground}
              fill={favoriteProIds.includes(pro.id) ? colors.primaryForeground : "none"}
            />
          </button>
        </div>
        <div style={{ padding: "0 var(--space-24) var(--space-24)", marginTop: -40 }}>
          <ProPhoto
            pro={pro}
            size={84}
            radius="var(--radius-4xl)"
            style={{ border: `3px solid ${colors.card}`, boxShadow: "var(--shadow-md)" }}
          />
          <h1
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-xl)",
              color: colors.foreground,
              margin: "var(--space-12) 0 var(--space-2)",
            }}
          >
            {pro.name}
          </h1>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.mutedForeground,
              margin: "0 0 var(--space-6)",
            }}
          >
            {pro.role}
          </p>
          <div
            style={{ display: "flex", alignItems: "center", gap: "var(--space-12)", marginBottom: "var(--space-18)" }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.foreground,
                fontWeight: 600,
              }}
            >
              <RatingStars value={pro.rating} size={13} /> {ratingLabel(pro)}{" "}
              <span style={{ color: colors.mutedForeground, fontWeight: 400 }}>({pro.reviews})</span>
            </span>
          </div>

          <h2
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: colors.foreground,
              margin: "0 0 var(--space-6)",
            }}
          >
            Sobre
          </h2>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.mutedForeground,
              margin: "0 0 var(--space-18)",
            }}
          >
            {pro.description || "Este profissional ainda não escreveu uma descrição."}
          </p>

          <h2
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: colors.foreground,
              margin: "0 0 var(--space-10)",
            }}
          >
            Serviços
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-20)" }}
          >
            {pro.services.length === 0 && (
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  margin: 0,
                }}
              >
                Nenhum serviço cadastrado ainda.
              </p>
            )}
            {pro.services.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-12) var(--space-14)",
                  borderRadius: "var(--radius-xl)",
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-sm)",
                      color: colors.foreground,
                      display: "block",
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                  >
                    {s.durationMinutes} min
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-sm)",
                    fontWeight: 700,
                    color: colors.primaryText,
                  }}
                >
                  R$ {s.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <h2
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: colors.foreground,
              margin: "0 0 var(--space-10)",
            }}
          >
            Avaliações
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              padding: "var(--space-12) var(--space-14)",
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              marginBottom: pro.reviewList.length > 0 ? 10 : 20,
            }}
          >
            <RatingStars value={pro.rating} size={15} />
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.foreground,
                fontWeight: 700,
              }}
            >
              {ratingLabel(pro)}
            </span>
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              {pro.reviews > 0 ? `com base em ${pro.reviews} avaliações` : "ainda sem avaliações"}
            </span>
          </div>
          {pro.reviewList.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-8)",
                marginBottom: "var(--space-20)",
              }}
            >
              {pro.reviewList.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "var(--space-12) var(--space-14)",
                    borderRadius: "var(--radius-xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 700,
                        color: colors.foreground,
                      }}
                    >
                      {r.clientName}
                    </span>
                    <RatingStars value={r.rating} size={10} />
                  </div>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      margin: 0,
                    }}
                  >
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h2
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-base)",
              color: colors.foreground,
              margin: "0 0 var(--space-10)",
            }}
          >
            Localização
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              padding: "var(--space-12) var(--space-14)",
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${colors.border}`,
              background: colors.card,
              marginBottom: "var(--space-20)",
            }}
          >
            <MapPin size={16} color={colors.primary} />
            <div>
              <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.foreground, margin: 0 }}>
                {pro.address || "Endereço não informado"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "var(--space-12) var(--space-24) calc(var(--space-12) + env(safe-area-inset-bottom, 0px))",
          borderTop: `1px solid ${colors.border}`,
          background: colors.card,
          flexShrink: 0,
        }}
      >
        <PrimaryButton disabled={pro.services.length === 0} onClick={goToScheduling}>
          Agendar
        </PrimaryButton>
      </div>
    </div>
  );
}
