// Login simulado, sem autenticação real · API: nenhuma
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { Button, Heading, Stack, Text } from "../src/components/primitives";
import { Field, Screen, ScreenHeader } from "../src/components/ui";
import { colors } from "../src/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Screen>
      <ScreenHeader />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, paddingTop: 8, gap: 16 }}>
          <Stack gap={4}>
            <Heading size="3xl">Bem-vinda de volta</Heading>
            <Text size="sm" color={colors.mutedForeground}>
              Entre na sua conta Kira
            </Text>
          </Stack>
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            autoComplete="password"
            right={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Ocultar a senha" : "Mostrar a senha"}
                onPress={() => setShowPassword((s) => !s)}
                style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
              >
                {showPassword ? (
                  <EyeOff size={18} color={colors.mutedForeground} />
                ) : (
                  <Eye size={18} color={colors.mutedForeground} />
                )}
              </Pressable>
            }
          />
          <Button onPress={() => router.replace("/(tabs)")}>Entrar</Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
