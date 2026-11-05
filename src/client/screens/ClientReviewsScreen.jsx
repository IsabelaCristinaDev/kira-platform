// Perfil: avaliações feitas e atendimentos a avaliar · API: kira-backend (agendamentos e avaliações)
import { useSession } from "../../context/SessionContext";
import { useScheduling } from "../../context/SchedulingContext";
import { errorMessage } from "../../shared/api";
import { EmptyState, ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProPhoto, RatingStars } from "../components/ProfessionalCards";
import { useMyAppointments, useMyReviews } from "../hooks/useProfessionals";

// === PERFIL: Minhas avaliações ===
export default function ClientReviewsScreen() {
  const { setScreen } = useSession();
  const { setSelectedAppointmentId } = useScheduling();
  const appointments = useMyAppointments();
  const reviews = useMyReviews();
  const reviewed = (appointments.data ?? []).filter((a) => a.status === "concluido");
  const loading = appointments.isLoading || reviews.isLoading;
  const failed = appointments.isError ? appointments : reviews.isError ? reviews : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
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
          Minhas avaliações
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Avaliações que você deixou para profissionais atendidos.
        </p>
        {loading ? (
          <SkeletonLoading count={3} />
        ) : failed ? (
          <ErrorState
            onRetry={failed.refetch}
            message={errorMessage(failed.error, "Não foi possível carregar suas avaliações.")}
          />
        ) : reviewed.length === 0 ? (
          <EmptyState onClear={() => setScreen("clientProfile")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {reviewed.map((a) => {
              const review = reviews.data.find((r) => r.appointmentId === a.id);
              return (
                <div
                  key={a.id}
                  style={{
                    padding: "var(--space-14)",
                    borderRadius: "var(--radius-2xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-10)",
                      marginBottom: "var(--space-8)",
                    }}
                  >
                    <ProPhoto pro={{ name: a.proName, photo: null }} size={36} radius="var(--radius-md)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontSize: "var(--font-size-xs)",
                          fontWeight: 700,
                          color: colors.foreground,
                          margin: 0,
                        }}
                      >
                        {a.proName}
                      </p>
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontSize: "var(--font-size-xs)",
                          color: colors.mutedForeground,
                          margin: 0,
                        }}
                      >
                        {a.service}
                      </p>
                    </div>
                    {review && <RatingStars value={review.rating} size={12} />}
                  </div>
                  {review ? (
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                        margin: 0,
                      }}
                    >
                      {review.text}
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedAppointmentId(a.id);
                        setScreen("clientAgendaDetail");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 700,
                        color: colors.primaryText,
                      }}
                    >
                      Avaliar este atendimento
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
