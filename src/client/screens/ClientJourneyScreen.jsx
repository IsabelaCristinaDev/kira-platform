// Jornada completa do cliente · demonstração: etapa atual derivada do status do agendamento, horários de exemplo
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { DemoBanner } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { SecondaryButton } from "../../shared/components/ui";
import { journeySteps } from "../../shared/data/demo";
import { colors, fontBody, gradientKira } from "../../shared/theme";
import { JourneyTimeline } from "../components/JourneyTimeline";
import { appointmentsMock } from "../data/mocks";

// próximo: já confirmado, falta o pagamento; concluído: falta a avaliação/fidelidade; cancelado: nenhuma etapa avança
const currentOf = (status) => (status === "proximo" ? 5 : status === "concluido" ? 7 : 3);

export default function ClientJourneyScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const appointment = appointmentsMock.find((a) => a.id === selectedAppointmentId) || appointmentsMock[0];
  const current = currentOf(appointment.status);
  const pct = Math.round((current / journeySteps.length) * 100);
  return (
    <ScreenFrame
      onBack={() => setScreen("clientAgendaDetail")}
      title="Sua jornada Kira"
      subtitle={`${appointment.service} · ${appointment.date}, ${appointment.time}`}
    >
      <DemoBanner>Jornada de demonstração: as etapas e horários são de exemplo, não um histórico real.</DemoBanner>
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
