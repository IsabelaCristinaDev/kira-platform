// Agendamento: escolher dia e horário (api.availability), revisar e confirmar · mock
import { useScheduling } from "@kira/context/SchedulingContext";
import { api } from "@kira/shared/api";
import { mockProfessionals } from "@kira/shared/data/professionals";
import { startOfDay } from "@kira/shared/utils/date";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { CalendarCheck, CalendarX } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Chip, Heading, Stack, Text } from "../src/components/primitives";
import { EmptyState, ErrorState } from "../src/components/states";
import { Screen, ScreenHeader } from "../src/components/ui";
import { colors, radius } from "../src/theme";

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const dayChip = (d) => `${weekdays[d.getDay()]} ${d.getDate()}`;
const longDate = (d) => `${weekdays[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`;

export default function SchedulingScreen() {
  const router = useRouter();
  const {
    selectedProId,
    selectedDate,
    scheduleTime,
    setScheduleTime,
    selectScheduleDate,
    retriedDatesRef,
    retrySchedule,
  } = useScheduling();
  const [step, setStep] = useState("choose");
  const pro = mockProfessionals.find((p) => p.id === selectedProId) ?? mockProfessionals[0];
  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 14 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  }, []);

  // horários do dia escolhido (mock com latência e um erro simulado; ver api.availability)
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
  const loading = availability.isFetching;
  const failed = availability.isError && !availability.isFetching;

  if (step === "done") {
    return (
      <Screen>
        <Stack gap={14} align="center" justify="center" style={{ flex: 1, padding: 32 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radius.round,
              backgroundColor: colors.primary12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarCheck size={34} color={colors.primaryText} />
          </View>
          <Heading size="2xl" style={{ textAlign: "center" }}>
            Agendamento confirmado
          </Heading>
          <Text size="md" color={colors.mutedForeground} style={{ textAlign: "center" }}>
            {longDate(selectedDate)} às {scheduleTime}, com {pro.name}.
          </Text>
          <View style={{ alignSelf: "stretch", gap: 10, marginTop: 8 }}>
            <Button onPress={() => router.replace("/(tabs)")}>Voltar para o início</Button>
          </View>
        </Stack>
      </Screen>
    );
  }

  if (step === "review") {
    return (
      <Screen>
        <ScreenHeader onBack={() => setStep("choose")} />
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 16 }}>
          <Heading size="2xl">Confirmar agendamento</Heading>
          <Card padding={16} style={{ gap: 6 }}>
            <Text size="md" weight={700}>
              {pro.name}
            </Text>
            <Text size="sm" color={colors.mutedForeground}>
              {pro.role}
            </Text>
            <Text size="md" style={{ marginTop: 8 }}>
              {longDate(selectedDate)} às {scheduleTime}
            </Text>
            <Text size="lg" weight={700} color={colors.primaryText} style={{ marginTop: 4 }}>
              R$ {pro.price}
            </Text>
          </Card>
          <Text size="xs" color={colors.mutedForeground}>
            Confira os dados antes de confirmar.
          </Text>
          <Button onPress={() => setStep("done")}>Confirmar agendamento</Button>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
        <Stack gap={2}>
          <Heading size="2xl">Escolha o horário</Heading>
          <Text size="sm" color={colors.mutedForeground}>
            {pro.name} · {pro.role}
          </Text>
        </Stack>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {days.map((d) => (
            <Chip
              key={d.toISOString()}
              active={selectedDate?.toDateString() === d.toDateString()}
              onPress={() => selectScheduleDate(d)}
            >
              {dayChip(d)}
            </Chip>
          ))}
        </ScrollView>
        {!selectedDate ? (
          <Text size="sm" color={colors.mutedForeground}>
            Escolha um dia para ver os horários.
          </Text>
        ) : loading ? (
          <Text size="sm" color={colors.mutedForeground} accessibilityRole="progressbar">
            Buscando horários...
          </Text>
        ) : failed ? (
          <ErrorState
            message="Não foi possível carregar os horários."
            onRetry={() => retrySchedule(availability.refetch)}
          />
        ) : times.length === 0 ? (
          <EmptyState icon={CalendarX} title="Sem horários neste dia" message="Escolha outro dia para continuar." />
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {times.map((t) => (
              <Chip key={t} active={scheduleTime === t} onPress={() => setScheduleTime(t)}>
                {t}
              </Chip>
            ))}
          </View>
        )}
        <Button disabled={!selectedDate || !scheduleTime} onPress={() => setStep("review")}>
          Continuar para confirmação
        </Button>
      </ScrollView>
    </Screen>
  );
}
