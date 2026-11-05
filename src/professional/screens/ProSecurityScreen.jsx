// Segurança Kira: verificação, denúncia e emergência · API: kira-backend (avaliações) · futura API: POST /api/denuncias
import { BadgeCheck, CheckCircle2, Clock, User } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { ReportButton } from "../../shared/components/Safety";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { useBusinessData } from "../hooks/useBusinessData";
import { averageRating } from "../utils/metrics";

// "Segurança Kira" — perfil verificado, checklist de credibilidade e
// Canal de Segurança, conforme a segunda página do folheto profissional.
export default function ProSecurityScreen() {
  const { pForm } = useSignup();
  const { setScreen } = useSession();
  const hasDocs = !!pForm.docFrontPhoto && !!pForm.docBackPhoto;
  const certCount = pForm.specialties.length;
  const { reviews } = useBusinessData();
  const rating = averageRating(reviews);
  const verified = hasDocs;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
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
          Segurança Kira
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Credibilidade que gera confiança, para você e para seus clientes.
        </p>

        <div
          style={{
            borderRadius: "var(--radius-3xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: "var(--space-18)",
            marginBottom: "var(--space-20)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "var(--space-12)", marginBottom: "var(--space-16)" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-round)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: colors.muted,
                flexShrink: 0,
              }}
            >
              {pForm.photo ? (
                <img
                  src={pForm.photo}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={22} color={colors.mutedForeground} />
              )}
            </div>
            <div>
              <p
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "var(--font-size-md)",
                  color: colors.foreground,
                  margin: 0,
                }}
              >
                {pForm.name || "Profissional Kira"}
              </p>
              {verified && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: colors.primaryText,
                    marginTop: "var(--space-2)",
                  }}
                >
                  <BadgeCheck size={13} /> Perfil verificado
                </span>
              )}
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-14)" }}
          >
            {[
              { label: "Documento validado", detail: hasDocs ? "CPF confirmado" : "Pendente", done: hasDocs },
              {
                label: "Certificados autenticados",
                detail: `${certCount} certificado${certCount === 1 ? "" : "s"} enviado${certCount === 1 ? "" : "s"}`,
                done: certCount > 0,
              },
              {
                label: "Avaliações reais",
                detail:
                  rating != null ? `${rating} · ${reviews.length} avaliações de clientes` : "Nenhuma avaliação ainda",
                done: rating != null,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-10)",
                  padding: "var(--space-10) var(--space-12)",
                  borderRadius: "var(--radius-lg)",
                  background: colors.muted,
                }}
              >
                {item.done ? (
                  <CheckCircle2 size={16} color={colors.primary} />
                ) : (
                  <Clock size={16} color={colors.mutedForeground} />
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      color: colors.foreground,
                      margin: 0,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      margin: 0,
                    }}
                  >
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "var(--space-8)" }}>
            <span
              style={{
                padding: "var(--space-8) var(--space-12)",
                borderRadius: "var(--radius-pill)",
                background: gradientKira,
                color: colors.primaryForeground,
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 700,
              }}
            >
              Pagamento protegido
            </span>
            <button
              type="button"
              className="k-reset"
              onClick={() => setScreen("proFinance")}
              style={{
                padding: "var(--space-8) var(--space-12)",
                borderRadius: "var(--radius-pill)",
                background: colors.muted,
                color: colors.foreground,
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Histórico completo
            </button>
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
          Canal de Segurança
        </h2>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-14)",
          }}
        >
          A proteção vale para os dois lados. Clientes também passam por verificação, e você pode reportar qualquer
          situação suspeita de forma protegida, com análise da equipe Kira.
        </p>
        <ReportButton papel="PROFISSIONAL" />
      </div>
    </div>
  );
}
