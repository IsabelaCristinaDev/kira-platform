// Transferência para atendente: botão "Falar com atendente" e cartão de espera com cancelar · API: nenhuma
import { Headset, Loader2 } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Heading, Text } from "../components/primitives";
import { colors, radius, shadowGlow } from "../theme";
import { Spinner } from "./Spinner";

export const HandoffButton = ({ onPress }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => ({
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minHeight: 44,
      paddingHorizontal: 16,
      borderRadius: radius.pill,
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
      opacity: pressed ? 0.8 : 1,
    })}
  >
    <Headset size={18} color={colors.primaryText} />
    <Text size="md" weight={600} color={colors.primaryText}>
      Falar com atendente
    </Text>
  </Pressable>
);

export const HandoffBanner = ({ onCancel }) => (
  <View
    accessibilityLiveRegion="polite"
    style={{
      gap: 8,
      padding: 16,
      borderRadius: radius["4xl"],
      backgroundColor: colors.surfaceSoft,
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
      <View
        style={[
          {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.card,
            alignItems: "center",
            justifyContent: "center",
          },
          shadowGlow,
        ]}
      >
        <Spinner>
          <Loader2 size={22} color={colors.primaryText} />
        </Spinner>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Heading size="md" style={{ fontFamily: "DMSans_700Bold", lineHeight: 20 }}>
          Conectando você a um atendente...
        </Heading>
        <Text size="sm" color={colors.mutedForeground} style={{ lineHeight: 19 }}>
          A resposta chega aqui mesmo, neste chat. Se você sair, avisamos por notificação quando alguém entrar.
        </Text>
      </View>
    </View>
    <Pressable
      accessibilityRole="button"
      onPress={onCancel}
      style={{ minHeight: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 }}
    >
      <Text size="md" weight={600} color={colors.primaryText} style={{ textAlign: "center" }}>
        Cancelar e voltar para a nossa inteligência artificial
      </Text>
    </Pressable>
  </View>
);
