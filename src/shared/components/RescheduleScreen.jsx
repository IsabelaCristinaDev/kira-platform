// Remarcar: mesmo serviço e funcionária, novo dia e horário, para a cliente e para o estúdio · API: kira-backend (slots de disponibilidade); o PATCH vem por `reschedule`
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { api, errorMessage } from "../api";
import { colors, fontBody, fontDisplay, gradientKira } from "../theme";
import { startOfDay } from "../utils/date";
import { CalendarHeader, CalendarMonth, EmptySchedule, LoadingSchedule, TimeSlotGrid } from "./Calendar";
import { ErrorState, SkeletonLoading } from "./states";
import { Header, PrimaryButton } from "./ui";

const longDate = (date) => date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

// `appointments` é a consulta da lista (cliente ou estúdio); `summary` descreve o atendimento para quem está remarcando
export function RescheduleScreen({
  appointments,
  appointmentId,
  reschedule,
  summary,
  doneLabel,
  onBack,
  onNotFound,
  onSaved,
}) {
  const queryClient = useQueryClient();
  const appointment = appointments.data?.find((a) => a.id === appointmentId);
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);

  const availability = useQuery({
    queryKey: ["availability", appointment?.id, selectedDate?.toDateString()],
    queryFn: () => api.availability.forAppointment({ appointment, date: selectedDate }),
    enabled: !!appointment && !!selectedDate,
  });
  const times = availability.data ?? [];

  const save = useMutation({
    mutationFn: () => {
      const [h, m] = time.split(":").map(Number);
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h, m);
      return reschedule({ id: appointment.id, start });
    },
    onSuccess: () => {
      onSaved?.(selectedDate);
      return Promise.all(
        [["appointments"], ["availability"]].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      );
    },
  });

  const changeMonth = (delta) => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setMonthAnimKey((k) => k + 1);
  };
  const selectDate = (date) => {
    setSelectedDate(date);
    setTime(null);
    save.reset();
  };
  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());

  if (!appointment) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={onBack} />
        <div style={{ padding: "0 var(--space-24) var(--space-32)" }}>
          {appointments.isLoading ? (
            <SkeletonLoading count={2} />
          ) : (
            <ErrorState
              onRetry={appointments.isError ? appointments.refetch : onNotFound}
              message={
                appointments.isError
                  ? errorMessage(appointments.error, "Não foi possível carregar o agendamento.")
                  : "Agendamento não encontrado."
              }
            />
          )}
        </div>
      </div>
    );
  }

  if (save.isSuccess) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={onBack} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-14)",
            padding: "0 var(--space-24) var(--space-32)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-round)",
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={30} color={colors.primaryForeground} />
          </div>
          <h1
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-xl)",
              color: colors.foreground,
              margin: 0,
            }}
          >
            Horário remarcado!
          </h1>
          <p
            role="status"
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 }}
          >
            {summary(appointment)} • {longDate(selectedDate)} às {time}
          </p>
          <div style={{ width: "100%", maxWidth: 260 }}>
            <PrimaryButton onClick={onBack}>{doneLabel}</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={onBack} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Remarcar horário
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          {summary(appointment)}. Hoje está marcado para {appointment.date.toLowerCase()} às {appointment.time}.
        </p>

        <CalendarHeader
          monthDate={viewMonth}
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
          canGoPrev={canGoPrev}
        />
        <div style={{ marginBottom: "var(--space-24)" }}>
          <CalendarMonth
            monthDate={viewMonth}
            selectedDate={selectedDate}
            today={today}
            monthKey={monthAnimKey}
            onSelect={selectDate}
          />
        </div>

        {!selectedDate && (
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
              textAlign: "center",
            }}
          >
            Escolha o novo dia.
          </p>
        )}

        {selectedDate && (
          <>
            <h2
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
                margin: "0 0 var(--space-10)",
              }}
            >
              Horários disponíveis
            </h2>
            {availability.isFetching ? (
              <LoadingSchedule />
            ) : availability.isError ? (
              <ErrorState
                onRetry={() => availability.refetch()}
                message={errorMessage(availability.error, "Não foi possível carregar os horários agora.")}
              />
            ) : times.length === 0 ? (
              <EmptySchedule />
            ) : (
              <TimeSlotGrid times={times} selectedTime={time} onSelect={setTime} />
            )}
          </>
        )}

        {time && (
          <div style={{ marginTop: "var(--space-20)" }}>
            {save.isError && (
              <p
                role="alert"
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.destructiveText,
                  margin: "0 0 var(--space-12)",
                }}
              >
                {errorMessage(save.error, "Não foi possível remarcar agora.")}
              </p>
            )}
            <PrimaryButton disabled={save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Remarcando..." : `Remarcar para ${longDate(selectedDate)} às ${time}`}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
