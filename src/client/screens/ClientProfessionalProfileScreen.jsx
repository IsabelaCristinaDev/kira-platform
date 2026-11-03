// Perfil da profissional (serviços, portfólio, avaliações) · mock
import { ArrowLeft, BadgeCheck, Bookmark, Clock, MapPin } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { PrimaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { RatingStars } from "../components/ProfessionalCards";
import { getProfileExtras, getRankingExtras } from "../data/mocks";

export default function ClientProfessionalProfileScreen() {
  const { favoriteProIds, toggleFavoriteProfessional } = useSearch();
  const { selectedProId, resetScheduling } = useScheduling();
  const { setScreen } = useSession();
  const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
  const extras = getProfileExtras(pro);
  const nextSlots = getRankingExtras(pro).nextSlot;
  const goToScheduling = () => {
    resetScheduling();
    setScreen("clientScheduling");
  };
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
        <div style={{ padding: "0 var(--space-24) var(--space-24)", marginTop: -40, position: "relative" }}>
          <img
            src={pro.photo}
            alt={pro.name}
            style={{
              width: 84,
              height: 84,
              borderRadius: "var(--radius-4xl)",
              objectFit: "cover",
              objectPosition: "center 25%",
              display: "block",
              border: `3px solid ${colors.card}`,
              boxShadow: "var(--shadow-md)",
            }}
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
          {extras.verified && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 700,
                color: colors.primaryText,
                margin: "0 0 var(--space-10)",
              }}
            >
              <BadgeCheck size={14} /> Profissional verificado
            </span>
          )}
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
              <RatingStars value={pro.rating} size={13} /> {pro.rating}{" "}
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
            {pro.description}
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
            {pro.services.map((s) => (
              <div
                key={s}
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
                    {s}
                  </span>
                  <span
                    style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
                  >
                    ≈ 45 min
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
                  R$ {pro.price}
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
            Portfólio
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "var(--space-8)",
              marginBottom: "var(--space-20)",
            }}
          >
            {extras.portfolio.map((photo, i) => (
              <img
                key={photo}
                src={photo}
                alt={`Trabalho ${i + 1} de ${pro.name}`}
                style={{
                  display: "block",
                  width: "100%",
                  minWidth: 0,
                  aspectRatio: "1/1",
                  borderRadius: "var(--radius-lg)",
                  objectFit: "cover",
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
              marginBottom: extras.reviewComments.length > 0 ? 10 : 20,
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
              {pro.rating}
            </span>
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              com base em {pro.reviews} avaliações
            </span>
          </div>
          {extras.reviewComments.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-8)",
                marginBottom: "var(--space-20)",
              }}
            >
              {extras.reviewComments.map((r) => (
                <div
                  key={`${r.author}-${r.text}`}
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
                      {r.author}
                    </span>
                    <RatingStars value={r.stars} size={10} />
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
                {extras.address}
              </p>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  margin: "var(--space-1) 0 0",
                }}
              >
                {pro.distance} km de você
              </p>
            </div>
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
            Disponibilidade
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
            }}
          >
            <Clock size={16} color={colors.primary} />
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.foreground }}>
              Próximo horário: {nextSlots}
            </span>
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
        <PrimaryButton onClick={goToScheduling}>Agendar</PrimaryButton>
      </div>
    </div>
  );
}
