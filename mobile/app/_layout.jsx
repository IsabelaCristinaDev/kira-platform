// Raiz do app: fontes da marca, providers e pilha de navegação (Expo Router) · API: nenhuma
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProviders } from "../src/context/AppProviders";
import { colors } from "../src/theme";

export default function RootLayout() {
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    PlayfairDisplay_700Bold,
  });
  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <AppProviders>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      </AppProviders>
    </SafeAreaProvider>
  );
}
