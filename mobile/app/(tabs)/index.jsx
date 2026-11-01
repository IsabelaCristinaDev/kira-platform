// Início do cliente: busca, categorias, profissionais perto e atalho para o atendimento · api.professionals
import { api } from "@kira/shared/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { MessageCircle, Search, Sparkles } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { Card, Chip, GradientBox, Heading, Stack, Text } from "../../src/components/primitives";
import { ErrorState, SkeletonLoading } from "../../src/components/states";
import { ProfessionalCard, Screen } from "../../src/components/ui";
import { useScheduling } from "@kira/context/SchedulingContext";
import { useSearch } from "../../src/context/SearchContext";
import { categories } from "../../src/data/categories";
import { colors, radius } from "../../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { setCategoryFilter } = useSearch();
  const { setSelectedProId, resetScheduling } = useScheduling();
  const load = useQuery({ queryKey: ["professionals"], queryFn: () => api.professionals.list() });
  const nearby = [...(load.data ?? [])].sort((a, b) => a.distance - b.distance).slice(0, 4);

  const openCategory = (id) => {
    setCategoryFilter(id);
    router.push("/(tabs)/buscar");
  };
  const openPro = (pro) => {
    setSelectedProId(pro.id);
    resetScheduling();
    router.push(`/profissional/${pro.id}`);
  };

  return (
    <Screen edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32, gap: 20 }}>
        <Stack gap={2}>
          <Text size="sm" color={colors.mutedForeground}>
            Olá, bem-vinda
          </Text>
          <Heading size="3xl">O que vamos cuidar hoje?</Heading>
        </Stack>

        <Pressable
          accessibilityRole="search"
          accessibilityLabel="Buscar profissional ou serviço"
          onPress={() => router.push("/(tabs)/buscar")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            minHeight: 48,
            paddingHorizontal: 16,
            borderRadius: radius.pill,
            backgroundColor: colors.muted,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Search size={18} color={colors.mutedForeground} />
          <Text size="md" color={colors.mutedForeground}>
            Buscar profissional ou serviço
          </Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {categories.map((c) => (
            <Chip key={c.id} onPress={() => openCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </ScrollView>

        <Pressable accessibilityRole="button" onPress={() => router.push("/atendimento")}>
          <GradientBox
            style={{ borderRadius: radius["4xl"], padding: 18, flexDirection: "row", alignItems: "center", gap: 14 }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.round,
                backgroundColor: "rgba(255,255,255,0.22)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={22} color={colors.white} />
            </View>
            <Stack gap={2} style={{ flex: 1 }}>
              <Text weight={700} color={colors.primaryForeground} size="base">
                Fale com a Kira
              </Text>
              <Text size="xs" color={colors.primaryForeground}>
                A nossa inteligência artificial ajuda a achar profissionais e horários.
              </Text>
            </Stack>
            <MessageCircle size={20} color={colors.primaryForeground} />
          </GradientBox>
        </Pressable>

        <Stack gap={12}>
          <Heading size="xl">Perto de você</Heading>
          {load.isFetching ? (
            <SkeletonLoading count={3} />
          ) : load.isError ? (
            <ErrorState onRetry={load.refetch} />
          ) : (
            <Stack gap={10}>
              {nearby.map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} onPress={() => openPro(pro)} />
              ))}
            </Stack>
          )}
        </Stack>
      </ScrollView>
    </Screen>
  );
}
