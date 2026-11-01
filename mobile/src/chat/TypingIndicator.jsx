// Indicador "digitando..." do chat: três pontos animados com as cores da marca · API: nenhuma
import { CHAT_AGENTS } from "@kira/shared/api/chatContract";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useReduceMotion } from "../hooks/useReduceMotion";
import { colors, radius } from "../theme";
import { AgentAvatar } from "./AgentAvatar";

const dotColors = [colors.accent, colors.primary, colors.violet];

const Dot = ({ color, delay, still }) => {
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (still) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(lift, { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.timing(lift, { toValue: 0, duration: 360, useNativeDriver: true }),
        Animated.delay(480 - delay),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [lift, delay, still]);
  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: color,
        opacity: lift.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
        transform: [{ translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
      }}
    />
  );
};

export const TypingIndicator = ({ agent }) => {
  const reduce = useReduceMotion();
  return (
    <View
      accessibilityLabel={agent === CHAT_AGENTS.HUMAN ? "A equipe está digitando" : "A Kira está digitando"}
      accessibilityLiveRegion="polite"
      style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, alignSelf: "flex-start" }}
    >
      <AgentAvatar agent={agent} size={28} />
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          paddingVertical: 16,
          paddingHorizontal: 18,
          borderRadius: radius["4xl"],
          borderBottomLeftRadius: radius.xs,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {dotColors.map((color, i) => (
          <Dot key={color} color={color} delay={i * 160} still={reduce} />
        ))}
      </View>
    </View>
  );
};
