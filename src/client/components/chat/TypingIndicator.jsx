// Indicador "digitando..." do chat: três pontos animados com as cores da marca · API: nenhuma
import { CHAT_AGENTS } from "../../../shared/api/chatContract";
import { colors } from "../../../shared/theme";
import { AgentAvatar } from "./AgentAvatar";

const dotColors = [colors.accent, colors.primary, "var(--color-violet)"];

export const TypingIndicator = ({ agent }) => (
  <div
    className="k-chat-in"
    role="status"
    aria-label={agent === CHAT_AGENTS.HUMAN ? "A equipe está digitando" : "A Kira está digitando"}
    style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-8)", alignSelf: "flex-start" }}
  >
    <AgentAvatar agent={agent} size={28} />
    <div
      style={{
        display: "flex",
        gap: "var(--space-5)",
        padding: "var(--space-16) var(--space-18)",
        borderRadius: "var(--radius-4xl) var(--radius-4xl) var(--radius-4xl) var(--radius-xs)",
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      {dotColors.map((color) => (
        <span
          key={color}
          aria-hidden="true"
          className="k-chat-dot"
          style={{ width: 8, height: 8, borderRadius: "var(--radius-round)", background: color }}
        />
      ))}
    </div>
  </div>
);
