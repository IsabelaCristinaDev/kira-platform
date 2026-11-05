// Jornada completa do cliente · agendamento real (kira-backend); etapa derivada do status dele, etapas sem dado no backend são ilustrativas
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { DemoBanner } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { SecondaryButton } from "../../shared/components/ui";
import { journeySteps } from "../../shared/data/demo";
import { colors, fontBody, gradientKira } from "../../shared/theme";
import { JourneyTimeline } from "../components/JourneyTimeline";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { useMyAppointments } from "../hooks/useProfessionals";

// próximo: já confirmado, falta o pagamento; concluído: falta a avaliação/fidelidade; cancelado: nenhuma etapa avança
const currentOf = (status) => (status === "proximo" ? 5 : status === "concluido" ? 7 : 3);

export default function ClientJourneyScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const appointments = useMyAppointments();
  const appointment = appointments.data?.find((a) => a.id === selectedAppointmentId);
  if (!appointment) {
    return (
      <ScreenFrame onBack={() => setScreen("clientAgenda")} title="Sua jornada Kira">
        {appointments.isLoading ? (
          <SkeletonLoading count={3} />
        ) : (
          <ErrorState
            onRetry={appointments.isError ? appointments.refetch : () => setScreen("clientAgenda")}
            message={
              appointments.isError
                ? errorMessage(appointments.error, "Não foi possível carregar o agendamento.")
                : "Agendamento não encontrado."
            }
          />
        )}
      </ScreenFrame>
    );
  }
  const current = currentOf(appointment.status);
  const pct = Math.round((current / journeySteps.length) * 100);
  return (
    <ScreenFrame
      onBack={() => setScreen("clientAgendaDetail")}
      title="Sua jornada Kira"
      subtitle={`${appointment.service} · ${appointment.date}, ${appointment.time}`}
    >
      <DemoBanner>
        A etapa atual vem do status do agendamento; as demais etapas são ilustrativas, não um histórico real.
      </DemoBanner>
      <div
        role="progressbar"
        aria-label="Progresso da jornada"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        style={{
          height: 6,
          borderRadius: "var(--radius-pill)",
          background: colors.muted,
          overflow: "hidden",
          marginBottom: "var(--space-6)",
        }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: gradientKira }} />
      </div>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-xs)",
          color: colors.mutedForeground,
          margin: "0 0 var(--space-18)",
        }}
      >
        Etapa {Math.min(current + 1, journeySteps.length)} de {journeySteps.length}
      </p>
      <JourneyTimeline steps={journeySteps} current={current} times={{ 3: appointment.date, 4: appointment.time }} />
      <div style={{ marginTop: "var(--space-20)" }}>
        <SecondaryButton onClick={() => setScreen("clientBookingTracking")}>
          Ver acompanhamento do agendamento
        </SecondaryButton>
      </div>
    </ScreenFrame>
  );
}
