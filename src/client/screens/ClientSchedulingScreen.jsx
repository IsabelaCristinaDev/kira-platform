// Agendamento: data e horário · mock com latência e erro simulados · futura API: GET /profissionais/:id/disponibilidade
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import {
  CalendarHeader,
  CalendarMonth,
  EmptySchedule,
  LoadingSchedule,
  TimeSlotGrid,
} from "../../shared/components/Calendar";
import { ErrorState } from "../../shared/components/states";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { api } from "../../shared/api";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { startOfDay } from "../../shared/utils/date";

export default function ClientSchedulingScreen() {
  const {
    bookedSlot,
    changeMonth,
    retriedDatesRef,
    retrySchedule,
    scheduleTime,
    selectScheduleDate,
    selectedDate,
    selectedProId,
    setAgendaTab,
    setScheduleTime,
    viewMonth,
  } = useScheduling();
  const { setScreen } = useSession();
  const today = startOfDay(new Date());
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
  // Horários do dia escolhido (mock com latência e um erro simulado; ver api.availability)
  const availability = useQuery({
    queryKey: ["availability", pro.id, selectedDate?.toDateString()],
    queryFn: () =>
      api.availability.get({
        pro,
        date: selectedDate,
        retried: retriedDatesRef.current.has(selectedDate.toDateString()),
      }),
    enabled: !!selectedDate,
  });
  const times = availability.data ?? [];
  const scheduleLoading = availability.isFetching;
  const scheduleError = availability.isError && !availability.isFetching;
  const handleChangeMonth = (delta) => {
    changeMonth(delta);
    setMonthAnimKey((k) => k + 1);
  };
  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("clientProfessionalProfile")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        {bookedSlot ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-14)",
              padding: "var(--space-48) 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "var(--radius-round)",
                background: gradientKira,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={32} color={colors.primaryForeground} />
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
              Agendamento confirmado!
            </h1>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              {pro.name} • {selectedDate?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })} às{" "}
              {bookedSlot}
            </p>
            <div
              style={{ width: "100%", maxWidth: 260, display: "flex", flexDirection: "column", gap: "var(--space-10)" }}
            >
              <PrimaryButton
                onClick={() => {
                  setAgendaTab("proximo");
                  setScreen("clientAgenda");
                }}
              >
                Ver na agenda
              </PrimaryButton>
              <SecondaryButton onClick={() => setScreen("clientHome")}>Voltar para o início</SecondaryButton>
            </div>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-xl)",
                color: colors.foreground,
                margin: "var(--space-4) 0 var(--space-4)",
              }}
            >
              Agendar com {pro.name}
            </h1>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                margin: "0 0 var(--space-18)",
              }}
            >
              Escolha o melhor dia e horário para o seu atendimento.
            </p>

            <CalendarHeader
              monthDate={viewMonth}
              onPrev={() => handleChangeMonth(-1)}
              onNext={() => handleChangeMonth(1)}
              canGoPrev={canGoPrev}
            />
            <div style={{ marginBottom: "var(--space-24)" }}>
              <CalendarMonth
                monthDate={viewMonth}
                selectedDate={selectedDate}
                today={today}
                monthKey={monthAnimKey}
                onSelect={selectScheduleDate}
              />
            </div>

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
                {scheduleLoading ? (
                  <LoadingSchedule />
                ) : scheduleError ? (
                  <ErrorState
                    onRetry={() => retrySchedule(availability.refetch)}
                    message="Não foi possível carregar os horários agora."
                  />
                ) : times.length === 0 ? (
                  <EmptySchedule />
                ) : (
                  <>
                    <TimeSlotGrid times={times} selectedTime={scheduleTime} onSelect={setScheduleTime} />
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                        textAlign: "center",
                        margin: "var(--space-14) 0 0",
                      }}
                    >
                      Toque em um horário para continuar.
                    </p>
                  </>
                )}
              </>
            )}

            {scheduleTime && (
              <div style={{ marginTop: "var(--space-20)" }}>
                <PrimaryButton onClick={() => setScreen("clientCheckout")}>Continuar para o pagamento</PrimaryButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
