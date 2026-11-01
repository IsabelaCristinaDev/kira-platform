// Informa se a pessoa pediu menos animação no aparelho · API: nenhuma
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => active && setReduce(value));
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);
  return reduce;
}
