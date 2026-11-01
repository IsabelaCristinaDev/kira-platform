// Canal de segurança: pedir ajuda em emergência ou reportar um problema · estático
import { useRouter } from "expo-router";
import { AlertTriangle, MessageSquareWarning } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { Card, Heading, Stack, Text } from "../src/components/primitives";
import { Screen, ScreenHeader } from "../src/components/ui";
import { colors, radius } from "../src/theme";

const Option = ({ icon: Icon, tone, title, text, onPress }) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
    <Card padding={16} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.round,
          backgroundColor: tone,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} color={colors.foreground} />
      </View>
      <Stack gap={2} style={{ flex: 1 }}>
        <Text size="base" weight={700}>
          {title}
        </Text>
        <Text size="sm" color={colors.mutedForeground} style={{ lineHeight: 19 }}>
          {text}
        </Text>
      </Stack>
    </Card>
  </Pressable>
);

export default function SafetyScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScreenHeader />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 16 }}>
        <Stack gap={4}>
          <Heading size="2xl">Segurança</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            Você não está sozinha. Escolha o que precisa agora.
          </Text>
        </Stack>
        <Option
          icon={AlertTriangle}
          tone={colors.destructive10}
          title="Estou em perigo agora"
          text="Ligue para o 190 e avise a equipe da Kira na hora."
          onPress={() => router.push("/denunciar?reason=risco_imediato")}
        />
        <Option
          icon={MessageSquareWarning}
          tone={colors.primary12}
          title="Reportar um problema"
          text="Denúncia anônima sobre um perfil ou atendimento."
          onPress={() => router.push("/denunciar")}
        />
      </ScrollView>
    </Screen>
  );
}
