// Avatar de quem atende no chat: gradiente com brilho para a IA, anel rosa com fone para o atendente · API: nenhuma
import { Headset, Sparkles } from "lucide-react";
import { CHAT_AGENTS } from "../../../shared/api/chatContract";
import { colors, gradientKira } from "../../../shared/theme";
import { ON_GRADIENT } from "../../chat/chatStyles";

export const AgentAvatar = ({ agent, size = 44 }) => {
  const human = agent === CHAT_AGENTS.HUMAN;
  const Icon = human ? Headset : Sparkles;
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-round)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        background: human ? "var(--color-primary-tint)" : gradientKira,
        border: human ? `2px solid ${colors.primary}` : "none",
        boxShadow: human ? "none" : "var(--shadow-card-glow)",
      }}
    >
      <Icon size={Math.round(size / 2)} color={human ? colors.foreground : ON_GRADIENT} />
    </div>
  );
};
