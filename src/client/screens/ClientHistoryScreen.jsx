// Perfil: histórico de serviços · API: kira-backend (agendamentos do cliente)
import { useSession } from "../../context/SessionContext";
import { useScheduling } from "../../context/SchedulingContext";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { AppointmentCard } from "../components/ProfessionalCards";
import { useMyAppointments } from "../hooks/useProfessionals";

// === PERFIL: Histórico completo ===
export default function ClientHistoryScreen() {
  const { setScreen } = useSession();
  const { setSelectedAppointmentId } = useScheduling();
  const appointments = useMyAppointments();
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
          Histórico
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Todos os seus agendamentos, de qualquer status.
        </p>
        {appointments.isLoading ? (
          <SkeletonLoading count={3} />
        ) : appointments.isError ? (
          <ErrorState
            onRetry={appointments.refetch}
            message={errorMessage(appointments.error, "Não foi possível carregar o histórico.")}
          />
        ) : appointments.data.length === 0 ? (
          <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground }}>
            Você ainda não tem agendamentos.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {appointments.data.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                onClick={() => {
                  setSelectedAppointmentId(a.id);
                  setScreen("clientAgendaDetail");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
