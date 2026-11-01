// Provador virtual, passo 3: gera a prévia (api.tryOn) e mostra profissionais compatíveis (api.recommendations)
import { useScheduling } from "@kira/context/SchedulingContext";
import { api } from "@kira/shared/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Card, GradientBox, Heading, Stack, Text } from "../../src/components/primitives";
import { ErrorState, SkeletonBlock, SkeletonLoading } from "../../src/components/states";
import { ProfessionalCard, Screen, ScreenHeader } from "../../src/components/ui";
import { useTryOn } from "../../src/context/TryOnContext";
import { colors, radius } from "../../src/theme";

const Preview = ({ label, uri, highlight }) => (
  <View style={{ flex: 1, gap: 4 }}>
    <Text
      size="xs"
      weight={highlight ? 700 : 400}
      color={highlight ? colors.primaryText : colors.mutedForeground}
      style={{ textAlign: "center" }}
    >
      {label}
    </Text>
    <View style={{ aspectRatio: 1, borderRadius: radius.xl, overflow: "hidden", backgroundColor: colors.muted }}>
      <Image source={{ uri }} accessibilityLabel={label} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      {highlight && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: colors.primary12,
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: radius.xl,
          }}
        />
      )}
    </View>
  </View>
);

const CompatibilityBadge = ({ value }) => (
  <GradientBox
    style={{
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: radius.pill,
    }}
  >
    <Sparkles size={11} color={colors.primaryForeground} />
    <Text size="xs" weight={700} color={colors.primaryForeground}>
      {value}% compatível com seu visual
    </Text>
  </GradientBox>
);

export default function TryOnResultScreen() {
  const router = useRouter();
  const { referenceUri, photoUri } = useTryOn();
  const { setSelectedProId, resetScheduling } = useScheduling();
  const generation = useMutation({ mutationFn: () => api.tryOn.generate({ referenceUri, photoUri }) });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    generation.mutate();
  }, [generation]);

  const result = generation.data;
  const recommendations = useQuery({
    queryKey: ["tryon", "recommendations", referenceUri, photoUri],
    queryFn: () =>
      api.recommendations.get({
        service: null,
        category: null,
        referenceImage: referenceUri,
        generatedImage: result?.resultUri,
        preferences: [],
        location: null,
        priceRange: null,
        limit: 5,
      }),
    enabled: !!result,
  });

  const openPro = (pro) => {
    setSelectedProId(pro.id);
    resetScheduling();
    router.push(`/profissional/${pro.id}`);
  };

  return (
    <Screen>
      <ScreenHeader onBack={() => router.replace("/provador/foto")} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
        <Stack gap={4}>
          <Heading size="2xl">Prévia do resultado</Heading>
          <Text size="xs" color={colors.mutedForeground}>
            É assim que esse visual pode ficar em você. Que tal encontrar quem sabe fazer igual?
          </Text>
        </Stack>

        {generation.isPending || generation.isIdle ? (
          <Stack
            gap={14}
            align="center"
            accessibilityRole="progressbar"
            accessibilityLabel="Gerando a prévia"
            style={{ paddingVertical: 24 }}
          >
            <SkeletonBlock height={160} width="100%" style={{ borderRadius: radius.xl }} />
            <Text size="md" weight={600} style={{ textAlign: "center" }}>
              Nossa inteligência artificial está criando a sua prévia...
            </Text>
            <Text size="xs" color={colors.mutedForeground} style={{ textAlign: "center" }}>
              Isso leva alguns segundos.
            </Text>
          </Stack>
        ) : generation.isError ? (
          <Stack gap={10}>
            <ErrorState
              message="Não foi possível gerar a prévia agora. Tente de novo ou troque a foto."
              onRetry={() => generation.mutate()}
            />
            <Button variant="secondary" onPress={() => router.replace("/provador/foto")}>
              Trocar a foto
            </Button>
          </Stack>
        ) : (
          <>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Preview label="Referência" uri={referenceUri} />
              <Preview label="Resultado (prévia)" uri={result.resultUri} highlight />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 14,
                borderRadius: radius.xl,
                backgroundColor: colors.muted,
              }}
            >
              <Sparkles size={16} color={colors.primary} />
              <Text size="xs" color={colors.mutedForeground} style={{ flex: 1, lineHeight: 17 }}>
                Prévia gerada por nossa inteligência artificial. O resultado real pode variar conforme a profissional.
              </Text>
            </View>
            <Stack gap={12}>
              <Heading size="lg">Profissionais recomendados para você</Heading>
              {recommendations.isFetching ? (
                <>
                  <Text size="xs" color={colors.mutedForeground}>
                    Buscando profissionais para esse visual...
                  </Text>
                  <SkeletonLoading count={3} />
                </>
              ) : recommendations.isError ? (
                <ErrorState message="Não foi possível carregar as recomendações." onRetry={recommendations.refetch} />
              ) : (recommendations.data ?? []).length === 0 ? (
                <Text size="sm" color={colors.mutedForeground} style={{ textAlign: "center" }}>
                  Ainda não encontramos profissionais compatíveis com esse visual.
                </Text>
              ) : (
                recommendations.data.map((pro) => (
                  <Card key={pro.id} padding={10} style={{ gap: 8 }}>
                    <CompatibilityBadge value={pro.compatibility} />
                    <ProfessionalCard pro={pro} onPress={() => openPro(pro)} />
                  </Card>
                ))
              )}
            </Stack>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
