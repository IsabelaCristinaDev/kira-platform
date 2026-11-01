// Perfil do cliente: dados básicos e menu (ajuda e suporte abre o atendimento) · mock
import { useRouter } from "expo-router";
import {
  Bookmark,
  Calendar,
  CreditCard,
  HelpCircle,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Star,
  User,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Card, GradientBox, Heading, ListRow, Stack, Text } from "../../src/components/primitives";
import { Screen } from "../../src/components/ui";
import { useSearch } from "../../src/context/SearchContext";
import { colors, fonts, radius } from "../../src/theme";

const sections = (router) => [
  {
    title: "Minha atividade",
    items: [
      { label: "Meus agendamentos", icon: Calendar },
      { label: "Minhas avaliações", icon: Star },
      { label: "Profissionais favoritos", icon: Bookmark },
    ],
  },
  { title: "Pagamentos", items: [{ label: "Formas de pagamento", icon: CreditCard }] },
  {
    title: "Privacidade e segurança",
    items: [
      { label: "Consentimentos LGPD", icon: ShieldCheck, onPress: () => router.push("/consentimentos") },
      { label: "Segurança e denúncia", icon: ShieldAlert, onPress: () => router.push("/seguranca") },
    ],
  },
  {
    title: "Suporte",
    items: [{ label: "Ajuda e suporte", icon: HelpCircle, onPress: () => router.push("/ajuda") }],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { favoriteProIds } = useSearch();
  return (
    <Screen edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32, gap: 20 }}>
        <Stack align="center" gap={8}>
          <GradientBox
            style={{
              width: 80,
              height: 80,
              borderRadius: radius.round,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={36} color={colors.white} />
          </GradientBox>
          <Heading size="xl">Cliente Kira</Heading>
          <Text size="sm" color={colors.mutedForeground}>
            {favoriteProIds.length} profissionais favoritas
          </Text>
        </Stack>
        {sections(router).map((section) => (
          <Stack key={section.title} gap={8}>
            <Text
              size="xs"
              weight={700}
              color={colors.mutedForeground}
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              {section.title}
            </Text>
            <Card radiusSize="2xl">
              {section.items.map((item, i) => (
                <ListRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  onPress={item.onPress}
                  last={i === section.items.length - 1}
                />
              ))}
            </Card>
          </Stack>
        ))}
        <Card radiusSize="2xl">
          <ListRow icon={LogOut} label="Sair da conta" destructive last onPress={() => router.replace("/")} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
