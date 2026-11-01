// Abertura do app (Entrar) · API: nenhuma
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { GradientBox, Stack, Text } from "../src/components/primitives";
import { Screen } from "../src/components/ui";
import { colors, fonts, radius } from "../src/theme";

export default function SplashScreen() {
  const router = useRouter();
  return (
    <GradientBox style={{ flex: 1 }}>
      <Screen style={{ backgroundColor: "transparent", justifyContent: "center", paddingHorizontal: 24 }}>
        <Stack gap={40} align="center">
          <Stack gap={12} align="center">
            <Text style={{ fontFamily: fonts.display, fontSize: 96, lineHeight: 104, color: colors.primaryForeground }}>
              K
            </Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.primaryForeground }}>Kira</Text>
            <Text
              size="xs"
              color={colors.primaryForeground}
              style={{ letterSpacing: 2.4, textTransform: "uppercase", marginTop: 8 }}
            >
              Beleza com confiança
            </Text>
          </Stack>
          <View style={{ alignSelf: "stretch" }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/login")}
              style={({ pressed }) => ({
                minHeight: 52,
                borderRadius: radius.pill,
                backgroundColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text weight={700} color={colors.primaryText} size="base">
                Entrar
              </Text>
            </Pressable>
          </View>
        </Stack>
      </Screen>
    </GradientBox>
  );
}
