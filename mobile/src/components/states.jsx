// Estados de tela do app: esqueleto, vazio e erro com "tentar de novo" · API: nenhuma
import { RefreshCw } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { colors, radius } from "../theme";
import { Button, Heading, Stack, Text } from "./primitives";

export const SkeletonBlock = ({ height = 14, width = "100%", style }) => {
  const opacity = useRef(new Animated.Value(0.55)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[{ height, width, borderRadius: radius.xs, backgroundColor: colors.border, opacity }, style]}
    />
  );
};

export const SkeletonCard = () => (
  <View
    style={{ flexDirection: "row", gap: 12, padding: 14, borderRadius: radius["2xl"], backgroundColor: colors.muted }}
  >
    <SkeletonBlock width={56} height={56} style={{ borderRadius: radius.round }} />
    <Stack gap={8} style={{ flex: 1 }}>
      <SkeletonBlock width="60%" />
      <SkeletonBlock width="40%" height={12} />
      <SkeletonBlock width="75%" height={12} />
    </Stack>
  </View>
);

export const SkeletonLoading = ({ count = 4 }) => (
  <Stack gap={12} accessibilityRole="progressbar" accessibilityLabel="Carregando">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </Stack>
);

export const EmptyState = ({ icon: Icon, title, message, action, onAction }) => (
  <Stack gap={10} align="center" style={{ padding: 32 }}>
    {Icon && <Icon size={36} color={colors.mutedForeground} />}
    <Heading size="lg" style={{ textAlign: "center" }}>
      {title}
    </Heading>
    {message && (
      <Text size="sm" color={colors.mutedForeground} style={{ textAlign: "center" }}>
        {message}
      </Text>
    )}
    {action && (
      <Button variant="secondary" pad={12} radiusSize="xl" onPress={onAction}>
        {action}
      </Button>
    )}
  </Stack>
);

export const ErrorState = ({ onRetry, message = "Não foi possível carregar agora." }) => (
  <Stack gap={12} align="center" style={{ padding: 32 }} accessibilityRole="alert">
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: radius.round,
        backgroundColor: colors.primary12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RefreshCw size={22} color={colors.primaryText} />
    </View>
    <Text size="md" weight={500} style={{ textAlign: "center" }}>
      {message}
    </Text>
    {onRetry && (
      <View style={{ alignSelf: "stretch" }}>
        <Button variant="secondary" pad={12} radiusSize="xl" onPress={onRetry}>
          Tentar de novo
        </Button>
      </View>
    )}
  </Stack>
);
