// Consentimentos LGPD: situação do uso de fotos no Provador, revogar e apagar fotos · api.tryOn
import { Check, ShieldCheck } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Button, Card, Heading, Stack, Text } from "../src/components/primitives";
import { Screen, ScreenHeader } from "../src/components/ui";
import { useTryOn } from "../src/context/TryOnContext";
import { colors, radius } from "../src/theme";

const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-BR");

export default function ConsentsScreen() {
  const { consent, consentLoading, revokeConsent, deletePhotos } = useTryOn();
  const active = !!consent?.accepted;
  return (
    <Screen>
      <ScreenHeader />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
        <Stack gap={4}>
          <Heading size="2xl">Consentimentos LGPD</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            Você decide como as suas fotos são usadas.
          </Text>
        </Stack>
        <Card padding={16} style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.round,
                backgroundColor: colors.primary12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={20} color={colors.primaryText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text size="md" weight={700}>
                Uso de fotos no Provador virtual
              </Text>
              <Text size="xs" color={colors.mutedForeground}>
                {consentLoading
                  ? "Carregando..."
                  : active
                    ? `Ativo desde ${formatDate(consent.acceptedAt)}`
                    : "Sem consentimento ativo"}
              </Text>
            </View>
            {active && <Check size={18} color={colors.primary} />}
          </View>
          <Text size="sm" color={colors.mutedForeground} style={{ lineHeight: 19 }}>
            Usamos as fotos só para criar a prévia do visual com a nossa inteligência artificial.
          </Text>
        </Card>
        <Stack gap={8}>
          <Button
            variant="secondary"
            disabled={!active || deletePhotos.isPending}
            onPress={() => deletePhotos.mutate()}
          >
            {deletePhotos.isPending ? "Apagando..." : "Apagar minhas fotos"}
          </Button>
          <Button
            variant="secondary"
            disabled={!active || revokeConsent.isPending}
            onPress={() => revokeConsent.mutate()}
          >
            {revokeConsent.isPending ? "Revogando..." : "Revogar consentimento e apagar fotos"}
          </Button>
          {deletePhotos.isSuccess && (
            <Text size="sm" color={colors.mutedForeground} accessibilityLiveRegion="polite">
              Suas fotos foram apagadas.
            </Text>
          )}
          {revokeConsent.isSuccess && (
            <Text size="sm" color={colors.mutedForeground} accessibilityLiveRegion="polite">
              Consentimento revogado e fotos apagadas.
            </Text>
          )}
          {(deletePhotos.isError || revokeConsent.isError) && (
            <Text size="sm" color={colors.primaryText} accessibilityRole="alert">
              Não foi possível concluir agora. Tente de novo.
            </Text>
          )}
        </Stack>
      </ScrollView>
    </Screen>
  );
}
