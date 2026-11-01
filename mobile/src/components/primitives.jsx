// Primitivos de UI do app (Stack, Text, Heading, Card, Button, Chip, Badge, ListRow, GradientBox) · API: nenhuma
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { colors, fonts, fontSize, gradientKira, radius } from "../theme";

const weightFont = { 400: fonts.body, 500: fonts.bodyMedium, 600: fonts.bodySemi, 700: fonts.bodyBold };

export const GradientBox = ({ style, children, ...rest }) => (
  <LinearGradient {...gradientKira} style={style} {...rest}>
    {children}
  </LinearGradient>
);

export const Stack = ({ direction = "column", gap = 8, align, justify, style, children, ...rest }) => (
  <View style={[{ flexDirection: direction, gap, alignItems: align, justifyContent: justify }, style]} {...rest}>
    {children}
  </View>
);

export const Text = ({ size = "md", weight = 400, color = colors.foreground, style, children, ...rest }) => (
  <RNText style={[{ fontFamily: weightFont[weight], fontSize: fontSize[size], color }, style]} {...rest}>
    {children}
  </RNText>
);

export const Heading = ({ size = "2xl", color = colors.foreground, style, children, ...rest }) => (
  <RNText
    accessibilityRole="header"
    style={[{ fontFamily: fonts.display, fontSize: fontSize[size], color }, style]}
    {...rest}
  >
    {children}
  </RNText>
);

export const Card = ({ radiusSize = "2xl", padding, style, children, ...rest }) => (
  <View
    style={[
      {
        borderRadius: radius[radiusSize],
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        overflow: "hidden",
        padding,
      },
      style,
    ]}
    {...rest}
  >
    {children}
  </View>
);

// botão principal com gradiente e texto creme, ou secundário em rosa claro
export const Button = ({
  variant = "primary",
  radiusSize = "2xl",
  pad = 15,
  size = "md",
  icon: Icon,
  disabled,
  onPress,
  style,
  children,
  ...rest
}) => {
  const primary = variant === "primary";
  const tone = primary ? colors.primaryForeground : colors.primaryText;
  const label = (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
      {Icon && <Icon size={16} color={tone} />}
      <Text size={size} weight={600} color={tone} style={{ textAlign: "center" }}>
        {children}
      </Text>
    </View>
  );
  const box = {
    padding: pad,
    borderRadius: radius[radiusSize],
    minHeight: 44,
    justifyContent: "center",
    overflow: "hidden",
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: disabled ? 0.4 : pressed ? 0.85 : 1 }, style]}
      {...rest}
    >
      {primary ? (
        <GradientBox style={box}>{label}</GradientBox>
      ) : (
        <View style={[box, { backgroundColor: colors.muted }]}>{label}</View>
      )}
    </Pressable>
  );
};

export const Chip = ({ active, outlined, onPress, style, textStyle, children, ...rest }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: !!active }}
    onPress={onPress}
    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flexShrink: 0 }, style]}
    {...rest}
  >
    {active ? (
      <GradientBox
        style={{
          paddingVertical: 9,
          paddingHorizontal: 16,
          borderRadius: radius.pill,
          minHeight: 44,
          justifyContent: "center",
        }}
      >
        <Text size="xs" weight={600} color={colors.primaryForeground} style={textStyle}>
          {children}
        </Text>
      </GradientBox>
    ) : (
      <View
        style={{
          paddingVertical: 9,
          paddingHorizontal: 16,
          borderRadius: radius.pill,
          minHeight: 44,
          justifyContent: "center",
          backgroundColor: outlined ? colors.card : colors.muted,
          borderWidth: outlined ? 1 : 0,
          borderColor: colors.primaryTint,
        }}
      >
        <Text
          size={outlined ? "md" : "xs"}
          weight={outlined ? 500 : 600}
          color={outlined ? colors.primaryText : colors.foreground}
          style={textStyle}
        >
          {children}
        </Text>
      </View>
    )}
  </Pressable>
);

const badgeTones = {
  primary: { bg: colors.primary10, fg: colors.primaryText },
  danger: { bg: colors.destructive10, fg: colors.destructiveText },
  neutral: { bg: colors.muted, fg: colors.mutedForeground },
};

export const Badge = ({ tone = "primary", style, children }) => (
  <View
    style={[
      {
        alignSelf: "flex-start",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: radius.pill,
        backgroundColor: badgeTones[tone].bg,
      },
      style,
    ]}
  >
    <Text size="xs" weight={600} color={badgeTones[tone].fg}>
      {children}
    </Text>
  </View>
);

export const ListRow = ({ icon: Icon, label, onPress, destructive, last }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 48,
      paddingVertical: 13,
      paddingHorizontal: 14,
      borderBottomWidth: last ? 0 : 1,
      borderBottomColor: colors.border,
      opacity: pressed ? 0.7 : 1,
    })}
  >
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: radius.icon,
        backgroundColor: destructive ? colors.destructive10 : colors.muted,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={15} color={destructive ? colors.destructive : colors.mutedForeground} />
    </View>
    <Text
      size="sm"
      weight={destructive ? 600 : 500}
      color={destructive ? colors.destructiveText : colors.foreground}
      style={{ flex: 1 }}
    >
      {label}
    </Text>
    {!destructive && <ChevronRight size={16} color={colors.mutedForeground} />}
  </Pressable>
);
