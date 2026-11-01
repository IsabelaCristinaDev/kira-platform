// Gira o filho em volta do centro (carregando); parado quando a pessoa pede menos animação · API: nenhuma
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useReduceMotion } from "../hooks/useReduceMotion";

export const Spinner = ({ children }) => {
  const turn = useRef(new Animated.Value(0)).current;
  const reduce = useReduceMotion();
  useEffect(() => {
    if (reduce) return undefined;
    const loop = Animated.loop(
      Animated.timing(turn, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [turn, reduce]);
  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return <Animated.View style={{ transform: [{ rotate }] }}>{children}</Animated.View>;
};
