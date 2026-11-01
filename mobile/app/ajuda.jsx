// Ajuda e suporte: dúvidas frequentes e botão para o chat de atendimento · estático
import { useRouter } from "expo-router";
import { HelpCircle, MessageCircle } from "lucide-react-native";
import { ScrollView } from "react-native";
import { Button, Card, Heading, ListRow, Stack, Text } from "../src/components/primitives";
import { Screen, ScreenHeader } from "../src/components/ui";
import { colors } from "../src/theme";

const faq = ["Como funciona o Provador virtual?", "Como altero um agendamento?", "Como funciona o pagamento?"];

export default function HelpSupportScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScreenHeader />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
        <Stack gap={4}>
          <Heading size="2xl">Ajuda e suporte</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            Como podemos ajudar?
          </Text>
        </Stack>
        <Stack gap={8}>
          <Text
            size="xs"
            weight={700}
            color={colors.mutedForeground}
            style={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            Dúvidas frequentes
          </Text>
          <Card>
            {faq.map((q, i) => (
              <ListRow key={q} icon={HelpCircle} label={q} last={i === faq.length - 1} />
            ))}
          </Card>
        </Stack>
        <Button
          variant="secondary"
          radiusSize="lg"
          pad={12}
          size="sm"
          icon={MessageCircle}
          onPress={() => router.push("/atendimento")}
        >
          Conversar com o suporte
        </Button>
      </ScrollView>
    </Screen>
  );
}
