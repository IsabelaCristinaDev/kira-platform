// Agendamento: serviço, data, horário e confirmação · API: kira-backend (slots de disponibilidade e POST /api/agendamentos)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { CategoryChip, Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { api, errorMessage } from "../../shared/api";
import { useBookableDays } from "../../shared/hooks/useBookableDays";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { startOfDay } from "../../shared/utils/date";
import { useProfessional } from "../hooks/useProfessionals";

export default function ClientSchedulingScreen() {
  const {
    bookedSlot,
    changeMonth,
    scheduleTime,
    selectScheduleDate,
    selectedDate,
    selectedProId,
    selectedServiceId,
    setAgendaTab,
    setBookedSlot,
    setScheduleTime,
    setSelectedServiceId,
    viewMonth,
  } = useScheduling();
  const { setScreen } = useSession();
  const today = startOfDay(new Date());
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const queryClient = useQueryClient();
  const proQuery = useProfessional(selectedProId);
  const pro = proQuery.data;
  const isDayAvailable = useBookableDays(selectedProId);
  const service = pro?.services.find((s) => s.id === selectedServiceId) ?? null;
  // Horários livres do dia escolhido para o serviço escolhido
  const availability = useQuery({
    queryKey: ["availability", selectedProId, selectedServiceId, selectedDate?.toDateString()],
    queryFn: () => api.availability.get({ proId: selectedProId, serviceId: selectedServiceId, date: selectedDate }),
    enabled: !!selectedDate && !!selectedServiceId,
  });
  const times = availability.data ?? [];
  const scheduleLoading = availability.isFetching;
  const scheduleError = availability.isError && !availability.isFetching;
  const book = useMutation({
    mutationFn: () => {
      const [h, m] = scheduleTime.split(":").map(Number);
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h, m);
      return api.appointments.create({ proId: selectedProId, serviceId: selectedServiceId, start });
    },
    onSuccess: () => {
      setBookedSlot(scheduleTime);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
  const selectService = (id) => {
    setSelectedServiceId(id);
    setScheduleTime(null);
    book.reset();
  };
  const handleChangeMonth = (delta) => {
    changeMonth(delta);
    setMonthAnimKey((k) => k + 1);
  };
  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());
  if (!pro) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Header onBack={() => setScreen("clientProfessionalProfile")} />
        <div style={{ padding: "0 var(--space-24) var(--space-32)" }}>
          {proQuery.isError || !selectedProId ? (
            <ErrorState
              onRetry={selectedProId ? proQuery.refetch : () => setScreen("clientSearch")}
              message="Não foi possível carregar este profissional."
            />
          ) : (
            <SkeletonLoading count={2} />
          )}
        </div>
      </div>
    );
  }
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
              {service?.name} com {pro.name} •{" "}
              {selectedDate?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })} às {bookedSlot}
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
              Escolha o serviço, o dia e o horário do seu atendimento.
            </p>

            <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap", marginBottom: "var(--space-18)" }}>
              {pro.services.map((s) => (
                <CategoryChip
                  key={s.id}
                  label={`${s.name} · R$ ${s.price.toFixed(2)}`}
                  active={s.id === selectedServiceId}
                  onClick={() => selectService(s.id)}
                />
              ))}
            </div>

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
                isDayAvailable={isDayAvailable}
              />
            </div>

            {selectedDate && !selectedServiceId && (
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  textAlign: "center",
                }}
              >
                Escolha um serviço para ver os horários.
              </p>
            )}

            {selectedDate && selectedServiceId && (
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
                    onRetry={() => availability.refetch()}
                    message={errorMessage(availability.error, "Não foi possível carregar os horários agora.")}
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
                {book.isError && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.destructiveText,
                      margin: "0 0 var(--space-12)",
                    }}
                  >
                    {errorMessage(book.error, "Não foi possível confirmar o agendamento.")}
                  </p>
                )}
                <PrimaryButton disabled={book.isPending} onClick={() => book.mutate()}>
                  {book.isPending ? "Confirmando..." : "Confirmar agendamento"}
                </PrimaryButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
