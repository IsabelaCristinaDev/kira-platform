// Peças de tela do app: tela com área segura, cabeçalho com voltar, campo de texto, cartão de profissional · API: nenhuma
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin, Star } from "lucide-react-native";
import { Image, Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "../theme";
import { Stack, Text } from "./primitives";

export const Screen = ({ edges = ["top", "bottom"], style, children }) => (
  <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: colors.background }, style]}>
    {children}
  </SafeAreaView>
);

export const BackButton = ({ onPress }) => {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace("/(tabs)")))}
      style={{ width: 44, height: 44, borderRadius: radius.round, alignItems: "center", justifyContent: "center" }}
    >
      <ArrowLeft size={22} color={colors.foreground} />
    </Pressable>
  );
};

export const ScreenHeader = ({ onBack, children }) => (
  <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8 }}>
    <BackButton onPress={onBack} />
    {children}
  </View>
);

export const Field = ({ label, right, inputStyle, ...input }) => (
  <Stack gap={6}>
    <Text size="xs" weight={600} color={colors.mutedForeground}>
      {label}
    </Text>
    <View>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.mutedForeground}
        style={{
          minHeight: 48,
          paddingHorizontal: 14,
          paddingRight: right ? 48 : 14,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.muted,
          color: colors.foreground,
          fontFamily: "DMSans_400Regular",
          fontSize: 16,
          ...inputStyle,
        }}
        {...input}
      />
      {right && <View style={{ position: "absolute", right: 4, top: 2 }}>{right}</View>}
    </View>
  </Stack>
);

const formatPrice = (pro) => (typeof pro.price === "number" ? `R$ ${pro.price}` : pro.price);
const formatDistance = (pro) => (typeof pro.distance === "number" ? `${pro.distance} km` : pro.distance);

// cartão da profissional; aceita os dados da busca (números) e os do chat (texto)
export const ProfessionalCard = ({ pro, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${pro.name}, ${pro.role}`}
    onPress={onPress}
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: radius["2xl"],
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      opacity: pressed ? 0.85 : 1,
    })}
  >
    <Image
      source={{ uri: pro.photo }}
      style={{ width: 56, height: 56, borderRadius: radius.xl, backgroundColor: colors.muted }}
    />
    <View style={{ flex: 1 }}>
      <Text size="sm" weight={700}>
        {pro.name}
      </Text>
      <Text size="xs" color={colors.mutedForeground} style={{ marginTop: 1, marginBottom: 4 }}>
        {pro.role}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Star size={12} color={colors.accent} fill={colors.accent} />
          <Text size="xs" color={colors.mutedForeground}>
            {pro.rating}
            {pro.reviews ? ` (${pro.reviews})` : ""}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <MapPin size={12} color={colors.mutedForeground} />
          <Text size="xs" color={colors.mutedForeground}>
            {formatDistance(pro)}
          </Text>
        </View>
      </View>
    </View>
    <View style={{ alignItems: "flex-end" }}>
      <Text size="xs" color={colors.mutedForeground}>
        a partir de
      </Text>
      <Text size="md" weight={700} color={colors.primaryText}>
        {formatPrice(pro)}
      </Text>
    </View>
  </Pressable>
);
