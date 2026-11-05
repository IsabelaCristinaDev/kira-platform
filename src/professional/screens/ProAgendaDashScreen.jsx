// Agenda do profissional com calendário, concluir, remarcar, cancelar e conversar · API: kira-backend (GET /api/agendamentos/empresa/{id}, PATCH /concluir e /cancelar/empresa)
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { useProDashboard } from "../../context/ProDashboardContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { api, errorMessage } from "../../shared/api";
import { CalendarHeader, CalendarMonth } from "../../shared/components/Calendar";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { startOfDay } from "../../shared/utils/date";
import { ProBottomNav } from "../components/ProBottomNav";
import { statusOf } from "../../shared/data/appointments";
import { useBusinessData } from "../hooks/useBusinessData";
import { appointmentsOn } from "../utils/metrics";

// O profissional abre qualquer dia, inclusive passado, para ver e concluir atendimentos antigos
const allDaysAvailable = () => true;

// "Minha agenda" do profissional — reaproveita o CalendarHeader/CalendarMonth
// já existentes (genéricos, recebidos por props), só com estado próprio.
export default function ProAgendaDashScreen() {
  const { changeProMonth, proSelectedDate, proViewMonth, setProSelectedDate } = useProDashboard();
  const { goToProTab } = useSession();
  const today = startOfDay(new Date());
  const [proMonthAnimKey, setProMonthAnimKey] = useState(0);
  const handleChangeMonth = (delta) => {
    changeProMonth(delta);
    setProMonthAnimKey((k) => k + 1);
  };
  const business = useBusinessData();
  const dayAppointments = appointmentsOn(business.appointments, proSelectedDate);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "var(--space-20) var(--space-24) var(--space-4)" }}>
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
            margin: "0 0 var(--space-4)",
          }}
        >
          Horários em tempo real e confirmação automática
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8) var(--space-24) var(--space-24)" }}>
        <CalendarHeader
          monthDate={proViewMonth}
          onPrev={() => handleChangeMonth(-1)}
          onNext={() => handleChangeMonth(1)}
          canGoPrev
        />
        <div style={{ marginBottom: "var(--space-20)" }}>
          <CalendarMonth
            monthDate={proViewMonth}
            selectedDate={proSelectedDate}
            today={today}
            monthKey={proMonthAnimKey}
            onSelect={setProSelectedDate}
            isDayAvailable={allDaysAvailable}
          />
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
          Atendimentos de {proSelectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
        </h2>
        {business.loading ? (
          <SkeletonLoading count={2} />
        ) : business.error ? (
          <ErrorState
            onRetry={business.retry}
            message={errorMessage(business.error, "Não foi possível carregar a agenda.")}
          />
        ) : dayAppointments.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-8)",
              padding: "var(--space-28) var(--space-16)",
              textAlign: "center",
            }}
          >
            <Calendar size={28} color={colors.mutedForeground} />
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              Nenhum atendimento neste dia.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {dayAppointments.map((a) => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        )}
      </div>
      <ProBottomNav active="proAgendaDash" onNavigate={goToProTab} />
    </div>
  );
}

const ACTIVE_STATUSES = ["PENDENTE", "CONFIRMADO", "REAGENDADO"];

const actionButton = (tone) => ({
  flex: 1,
  padding: "var(--space-9) var(--space-12)",
  borderRadius: "var(--radius-lg)",
  fontFamily: fontBody,
  fontSize: "var(--font-size-xs)",
  fontWeight: 700,
  cursor: "pointer",
  ...(tone === "primary" && { border: "none", background: colors.primary, color: colors.primaryForeground }),
  ...(tone === "destructive" && {
    border: `1px solid hsl(var(--destructive-hsl) / 0.3)`,
    background: "hsl(var(--destructive-hsl) / 0.06)",
    color: colors.destructiveText,
  }),
  ...(tone === "neutral" && {
    border: `1px solid ${colors.border}`,
    background: colors.card,
    color: colors.foreground,
  }),
});

// Atendimento do dia. Ativo: concluir (depois que o horário começou), remarcar ou cancelar (com confirmação).
function AppointmentCard({ appointment: a }) {
  const { setSelectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const queryClient = useQueryClient();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ["appointments"] });
  const complete = useMutation({ mutationFn: () => api.appointments.complete(a.id), onSuccess });
  const cancel = useMutation({
    mutationFn: () => api.appointments.cancelAsBusiness(a.id),
    onSuccess: () => {
      setConfirmingCancel(false);
      return onSuccess();
    },
  });
  const active = ACTIVE_STATUSES.includes(a.rawStatus);
  const started = a.start <= new Date();
  const busy = complete.isPending || cancel.isPending;
  const failed = complete.error ?? cancel.error;
  return (
    <div
      style={{
        padding: "var(--space-12)",
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${colors.border}`,
        background: colors.card,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-12)" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-lg)",
            background: colors.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Clock size={17} color={colors.mutedForeground} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              margin: 0,
            }}
          >
            {a.clientName}
          </p>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              margin: "var(--space-1) 0 0",
            }}
          >
            {a.time} · {a.service}
            {a.staffName ? ` · ${a.staffName}` : ""}
          </p>
        </div>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            fontWeight: 700,
            color: statusOf(a).color,
          }}
        >
          {statusOf(a).label}
        </span>
      </div>
      {active && (
        <div style={{ display: "flex", gap: "var(--space-8)", marginTop: "var(--space-10)" }}>
          {confirmingCancel ? (
            <>
              <button type="button" disabled={busy} onClick={() => cancel.mutate()} style={actionButton("destructive")}>
                {cancel.isPending ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmingCancel(false)}
                style={actionButton("neutral")}
              >
                Voltar
              </button>
            </>
          ) : (
            <>
              {started && (
                <button type="button" disabled={busy} onClick={() => complete.mutate()} style={actionButton("primary")}>
                  {complete.isPending ? "Concluindo..." : "Concluir atendimento"}
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setSelectedAppointmentId(a.id);
                  setScreen("proReschedule");
                }}
                style={actionButton("neutral")}
              >
                Remarcar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmingCancel(true)}
                style={actionButton("destructive")}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setSelectedAppointmentId(a.id);
          setScreen("proConversation");
        }}
        style={{
          ...actionButton("neutral"),
          width: "100%",
          marginTop: "var(--space-8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-6)",
        }}
      >
        <MessageCircle size={14} aria-hidden="true" /> Conversar com {a.clientName.split(" ")[0]}
      </button>
      {failed && (
        <p
          role="alert"
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.destructiveText,
            margin: "var(--space-8) 0 0",
          }}
        >
          {errorMessage(failed, "Não foi possível atualizar o atendimento.")}
        </p>
      )}
    </div>
  );
}
