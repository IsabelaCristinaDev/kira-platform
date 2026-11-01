// Avatar de quem atende no chat: gradiente com brilho para a IA, anel rosa com fone para o atendente · API: nenhuma
import { CHAT_AGENTS } from "@kira/shared/api/chatContract";
import { Headset, Sparkles } from "lucide-react-native";
import { View } from "react-native";
import { GradientBox } from "../components/primitives";
import { colors, shadowGlow } from "../theme";

export const AgentAvatar = ({ agent, size = 44 }) => {
  const human = agent === CHAT_AGENTS.HUMAN;
  const Icon = human ? Headset : Sparkles;
  const box = { width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" };
  const icon = <Icon size={Math.round(size / 2)} color={human ? colors.foreground : colors.white} />;
  return human ? (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[box, { backgroundColor: colors.primaryTint, borderWidth: 2, borderColor: colors.primary }]}
    >
      {icon}
    </View>
  ) : (
    <GradientBox accessibilityElementsHidden importantForAccessibility="no" style={[box, shadowGlow]}>
      {icon}
    </GradientBox>
  );
};
