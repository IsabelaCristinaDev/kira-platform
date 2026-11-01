// Perfil da profissional: foto, avaliações, serviços, horários do dia e botão de agendar · mock
import { useScheduling } from "@kira/context/SchedulingContext";
import { mockProfessionals } from "@kira/shared/data/professionals";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BadgeCheck, Bookmark, Flag, MapPin, Star } from "lucide-react-native";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Badge, Button, Chip, GradientBox, Heading, Stack, Text } from "../../src/components/primitives";
import { Screen } from "../../src/components/ui";
import { useSearch } from "../../src/context/SearchContext";
import { colors, radius } from "../../src/theme";

const modeLabel = { presencial: "Presencial", domicilio: "A domicílio", ambos: "Presencial ou a domicílio" };

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { favoriteProIds, toggleFavoriteProfessional } = useSearch();
  const { setSelectedProId } = useScheduling();
  const pro = mockProfessionals.find((p) => String(p.id) === String(id)) ?? mockProfessionals[0];
  const favorite = favoriteProIds.includes(pro.id);

  const goSchedule = () => {
    setSelectedProId(pro.id);
    router.push("/agendar");
  };

  return (
    <Screen edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <GradientBox style={{ height: 160, justifyContent: "flex-start" }}>
          <Screen
            edges={["top"]}
            style={{
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 12,
              paddingTop: 8,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.round,
                backgroundColor: "rgba(255,255,255,0.28)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={20} color={colors.white} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
              onPress={() => toggleFavoriteProfessional(pro.id)}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.round,
                backgroundColor: "rgba(255,255,255,0.28)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bookmark size={20} color={colors.white} fill={favorite ? colors.white : "transparent"} />
            </Pressable>
          </Screen>
        </GradientBox>
        <View style={{ paddingHorizontal: 24, marginTop: -44, gap: 16 }}>
          <Image
            source={{ uri: pro.photo }}
            style={{
              width: 88,
              height: 88,
              borderRadius: radius["3xl"],
              borderWidth: 3,
              borderColor: colors.white,
              backgroundColor: colors.muted,
            }}
          />
          <Stack gap={4}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Heading size="2xl">{pro.name}</Heading>
              {pro.rating >= 4.6 && <BadgeCheck size={20} color={colors.primary} />}
            </View>
            <Text size="sm" color={colors.mutedForeground}>
              {pro.role}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Star size={14} color={colors.accent} fill={colors.accent} />
                <Text size="sm" weight={600}>
                  {pro.rating}
                </Text>
                <Text size="sm" color={colors.mutedForeground}>
                  ({pro.reviews})
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MapPin size={14} color={colors.mutedForeground} />
                <Text size="sm" color={colors.mutedForeground}>
                  {pro.distance} km
                </Text>
              </View>
            </View>
          </Stack>
          <Badge tone="neutral">{modeLabel[pro.mode]}</Badge>
          <Text size="md" color={colors.mutedForeground} style={{ lineHeight: 21 }}>
            {pro.description}
          </Text>
          <Stack gap={8}>
            <Heading size="lg">Serviços</Heading>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {pro.services.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </View>
          </Stack>
          <Stack gap={8}>
            <Heading size="lg">Próximos horários</Heading>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {pro.schedule.map((t) => (
                <Chip key={t} onPress={goSchedule}>
                  {t}
                </Chip>
              ))}
            </View>
          </Stack>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/denunciar?professionalId=${pro.id}`)}
            style={{ flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 }}
          >
            <Flag size={15} color={colors.mutedForeground} />
            <Text size="sm" weight={600} color={colors.mutedForeground}>
              Reportar este perfil
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Stack gap={0}>
          <Text size="xs" color={colors.mutedForeground}>
            a partir de
          </Text>
          <Text size="xl" weight={700} color={colors.primaryText}>
            R$ {pro.price}
          </Text>
        </Stack>
        <View style={{ flex: 1 }}>
          <Button onPress={goSchedule}>Agendar horário</Button>
        </View>
      </View>
    </Screen>
  );
}
