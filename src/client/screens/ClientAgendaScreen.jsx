// Agenda do cliente por abas · API: kira-backend (GET /api/agendamentos/cliente/{id})
import { Calendar } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { AppointmentCard } from "../components/ProfessionalCards";
import { appointmentTabs } from "../data/options";
import { useMyAppointments } from "../hooks/useProfessionals";

// ---------- Agenda ----------
export default function ClientAgendaScreen() {
  const { agendaTab, setAgendaTab, setSelectedAppointmentId } = useScheduling();
  const { goToTab, setScreen } = useSession();
  const appointments = useMyAppointments();
  const list = appointments.data ?? [];
  // Próximos em ordem de data; concluídos e cancelados do mais recente para o mais antigo
  const filtered = list
    .filter((a) => a.status === agendaTab)
    .sort((a, b) => (agendaTab === "proximo" ? a.start - b.start : b.start - a.start));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ padding: "0 var(--space-24) var(--space-4)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "0 0 var(--space-4)",
          }}
        >
          Minha agenda
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-16)",
          }}
        >
          Seus próximos momentos de beleza
        </p>
        <div style={{ display: "flex", gap: "var(--space-8)" }}>
          {appointmentTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setAgendaTab(t.id)}
              style={{
                flex: 1,
                padding: "var(--space-9) var(--space-8)",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: agendaTab === t.id ? gradientKira : colors.muted,
                color: agendaTab === t.id ? colors.primaryForeground : colors.mutedForeground,
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "var(--font-size-xs)",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-16) var(--space-24) var(--space-24)" }}>
        {appointments.isLoading ? (
          <SkeletonLoading count={3} />
        ) : appointments.isError ? (
          <ErrorState
            onRetry={appointments.refetch}
            message={errorMessage(appointments.error, "Não foi possível carregar sua agenda.")}
          />
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-10)",
              padding: "var(--space-48) var(--space-24)",
              textAlign: "center",
            }}
          >
            <Calendar size={30} color={colors.mutedForeground} />
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              Nenhum agendamento aqui ainda.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {filtered.map((a) => (
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
      <BottomNav active="clientAgenda" onNavigate={goToTab} />
    </div>
  );
}
