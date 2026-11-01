// Provador virtual: consentimento LGPD antes de usar as fotos com a nossa inteligência artificial · api.tryOn
import { useRouter } from "expo-router";
import { Check, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button, Card, Heading, Stack, Text } from "../../src/components/primitives";
import { Screen, ScreenHeader } from "../../src/components/ui";
import { useTryOn } from "../../src/context/TryOnContext";
import { colors, radius } from "../../src/theme";

const points = [
  "Usamos a sua foto e a foto de referência só para criar a prévia do visual, com a nossa inteligência artificial.",
  "A prévia é uma simulação. O resultado real pode variar conforme a profissional.",
  "Você pode revogar este consentimento e apagar suas fotos quando quiser, em Perfil, Consentimentos LGPD.",
];

export default function TryOnConsentScreen() {
  const router = useRouter();
  const { acceptConsent } = useTryOn();
  const [agreed, setAgreed] = useState(false);

  const accept = () => acceptConsent.mutate(undefined, { onSuccess: () => router.replace("/provador/resultado") });

  return (
    <Screen>
      <ScreenHeader />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.round,
            backgroundColor: colors.primary12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldCheck size={26} color={colors.primaryText} />
        </View>
        <Stack gap={4}>
          <Heading size="2xl">Antes de gerar sua prévia</Heading>
          <Text size="sm" color={colors.mutedForeground}>
            Suas fotos são dados pessoais. Precisamos do seu consentimento para usá-las.
          </Text>
        </Stack>
        <Card padding={16} style={{ gap: 14 }}>
          {points.map((point) => (
            <View key={point} style={{ flexDirection: "row", gap: 10 }}>
              <Check size={16} color={colors.primary} style={{ marginTop: 3 }} />
              <Text size="md" style={{ flex: 1, lineHeight: 21 }}>
                {point}
              </Text>
            </View>
          ))}
        </Card>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          onPress={() => setAgreed((v) => !v)}
          style={{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.xs,
              borderWidth: 2,
              borderColor: agreed ? colors.primary : colors.border,
              backgroundColor: agreed ? colors.primary : colors.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {agreed && <Check size={16} color={colors.white} />}
          </View>
          <Text size="md" style={{ flex: 1 }}>
            Li e concordo com o uso das minhas fotos para gerar a prévia.
          </Text>
        </Pressable>
        {acceptConsent.isError && (
          <Text size="sm" color={colors.primaryText} accessibilityRole="alert">
            Não foi possível registrar seu consentimento. Tente de novo.
          </Text>
        )}
        <Stack gap={8}>
          <Button disabled={!agreed || acceptConsent.isPending} onPress={accept}>
            {acceptConsent.isPending ? "Registrando..." : "Concordar e gerar prévia"}
          </Button>
          <Button variant="secondary" onPress={() => router.back()}>
            Agora não
          </Button>
        </Stack>
      </ScrollView>
    </Screen>
  );
}
