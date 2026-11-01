// Reportar problema: motivo, descrição e envio anônimo; "risco imediato" abre a emergência · api.reports
import { api } from "@kira/shared/api";
import { IMMEDIATE_REASON, REPORT_REASONS, REPORT_ROLES } from "@kira/shared/api/reportContract";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button, Heading, Stack, Text } from "../src/components/primitives";
import { Field, Screen, ScreenHeader } from "../src/components/ui";
import { EmergencyPanel } from "../src/safety/EmergencyPanel";
import { ReceiptView } from "../src/safety/ReceiptView";
import { colors, radius } from "../src/theme";

export default function ReportScreen() {
  const router = useRouter();
  const { professionalId, reason: initialReason } = useLocalSearchParams();
  const [reason, setReason] = useState(
    REPORT_REASONS.some((r) => r.value === initialReason) ? initialReason : "endereco_invalido",
  );
  const [description, setDescription] = useState("");
  const send = useMutation({
    mutationFn: (input) =>
      api.reports.submit({
        ...input,
        role: REPORT_ROLES.CLIENT,
        professionalId: professionalId ? Number(professionalId) : undefined,
      }),
  });
  const close = () => (router.canGoBack() ? router.back() : router.replace("/(tabs)"));

  if (send.isSuccess) {
    return (
      <Screen>
        <ReceiptView receipt={send.data} onClose={close} />
      </Screen>
    );
  }

  if (reason === IMMEDIATE_REASON) {
    return (
      <Screen>
        <ScreenHeader onBack={close} />
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 16 }}>
          <Heading size="2xl">Emergência</Heading>
          <EmergencyPanel
            registering={send.isPending}
            failed={send.isError}
            onRegister={() => send.mutate({ reason: IMMEDIATE_REASON, description })}
            onChooseOther={() => {
              send.reset();
              setReason("outro");
            }}
          />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader onBack={close} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 16 }} keyboardShouldPersistTaps="handled">
        <Stack gap={4}>
          <Heading size="2xl">Reportar problema</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            Conte o que aconteceu. A equipe da Kira analisa cada denúncia.
          </Text>
        </Stack>
        <Stack gap={8} accessibilityRole="radiogroup">
          <Text size="xs" weight={600} color={colors.mutedForeground}>
            Motivo
          </Text>
          {REPORT_REASONS.map((r) => {
            const checked = reason === r.value;
            return (
              <Pressable
                key={r.value}
                accessibilityRole="radio"
                accessibilityState={{ checked }}
                onPress={() => setReason(r.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  minHeight: 48,
                  paddingHorizontal: 14,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: checked ? colors.primary : colors.border,
                  backgroundColor: checked ? colors.primary10 : colors.card,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: checked ? colors.primary : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {checked && (
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />
                  )}
                </View>
                <Text size="md" weight={checked ? 600 : 400}>
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </Stack>
        <Field
          label="Descreva o ocorrido (opcional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Conte o que aconteceu"
          multiline
          numberOfLines={4}
          inputStyle={{ minHeight: 104, paddingTop: 12, textAlignVertical: "top" }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={15} color={colors.destructive} />
          <Text size="xs" color={colors.destructiveText} style={{ flex: 1 }}>
            Em caso de risco imediato, ligue 190 antes de qualquer outra coisa.
          </Text>
        </View>
        <Text size="xs" color={colors.mutedForeground}>
          Sua identidade fica protegida perante o profissional e a equipe da Kira.
        </Text>
        {send.isError && (
          <Text size="sm" color={colors.primaryText} accessibilityRole="alert" style={{ lineHeight: 19 }}>
            Não foi possível enviar agora. Tente de novo. Se for urgente, ligue 190.
          </Text>
        )}
        <Button disabled={send.isPending} onPress={() => send.mutate({ reason, description })}>
          {send.isPending ? "Enviando..." : "Enviar denúncia anônima"}
        </Button>
      </ScrollView>
    </Screen>
  );
}
