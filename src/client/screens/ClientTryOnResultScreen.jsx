// Provador: resultado e botão Encontrar profissionais · ranking sobre os estúdios do kira-backend
import { Sparkles } from "lucide-react";
import { useRanking, useTryOn } from "../../context/TryOnContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { RecommendedProfessionalCard } from "../components/ProfessionalCards";

export default function ClientTryOnResultScreen() {
  const { goToPersonalizedRanking, tryOnClientPhoto, tryOnReference } = useTryOn();
  const { loadRanking, rankingError, rankingLoading, recommended } = useRanking();
  const { setBookedSlot, setSelectedProId } = useScheduling();
  const { setScreen } = useSession();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientTryOnPhoto")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Prévia do resultado
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          É assim que esse visual pode ficar em você. Que tal encontrar quem sabe fazer igual?
        </p>

        <div style={{ display: "flex", gap: "var(--space-10)", marginBottom: "var(--space-18)" }}>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: "0 0 var(--space-4)",
                textAlign: "center",
              }}
            >
              Referência
            </p>
            <img
              src={tryOnReference}
              alt="Referência"
              style={{ width: "100%", aspectRatio: "1/1", borderRadius: "var(--radius-xl)", objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.primaryText,
                fontWeight: 700,
                fontFamily: fontBody,
                margin: "0 0 var(--space-4)",
                textAlign: "center",
              }}
            >
              Resultado (prévia)
            </p>
            <div
              style={{
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={tryOnClientPhoto}
                alt="Prévia do resultado"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "hsl(var(--primary-hsl) / 0.18)",
                  border: `2px solid ${colors.primary}`,
                  borderRadius: "var(--radius-xl)",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
            padding: "var(--space-12) var(--space-14)",
            borderRadius: "var(--radius-xl)",
            background: colors.muted,
            marginBottom: "var(--space-20)",
          }}
        >
          <Sparkles size={16} color={colors.primary} />
          <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
            Prévia gerada por nossa inteligência artificial. O resultado real pode variar conforme o profissional.
          </span>
        </div>

        <PrimaryButton onClick={goToPersonalizedRanking}>Encontrar profissionais</PrimaryButton>

        <div style={{ marginTop: "var(--space-22)" }}>
          {rankingLoading ? (
            <>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  textAlign: "center",
                  margin: "0 0 var(--space-12)",
                }}
              >
                Buscando profissionais para esse visual...
              </p>
              <SkeletonLoading count={3} />
            </>
          ) : rankingError ? (
            <ErrorState onRetry={loadRanking} message="Não foi possível carregar as recomendações." />
          ) : recommended.length === 0 ? (
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                textAlign: "center",
                margin: "var(--space-24) 0",
              }}
            >
              Ainda não encontramos profissionais compatíveis com esse visual.
            </p>
          ) : (
            <>
              <h2
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: "var(--font-size-base)",
                  color: colors.foreground,
                  margin: "0 0 var(--space-12)",
                }}
              >
                Profissionais recomendados para você ✨
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-12)",
                  maxHeight: 420,
                  overflowY: "auto",
                }}
              >
                {recommended.map((pro) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
