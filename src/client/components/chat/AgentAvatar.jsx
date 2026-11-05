// Avatar de quem atende no chat: mascote da Kira para a IA, anel rosa com fone para o atendente · API: nenhuma
import { Headset } from "lucide-react";
import { CHAT_AGENTS } from "../../../shared/api/chatContract";
import mascote from "../../../assets/mascote-kira.png";
import { colors } from "../../../shared/theme";

export const AgentAvatar = ({ agent, size = 44, glow = false }) => {
  const human = agent === CHAT_AGENTS.HUMAN;
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
        background: human ? "var(--color-primary-tint)" : "transparent",
        border: human ? `2px solid ${colors.primary}` : "none",
        boxShadow: "none",
      }}
    >
      {human ? (
        <Headset size={Math.round(size / 2)} color={colors.foreground} />
      ) : (
        <img src={mascote} alt="" width={size} height={size} style={{ objectFit: "contain" }} />
      )}
    </div>
  );
};
