// Respostas rápidas do chat: chips que enviam o texto ao toque · API: nenhuma
import { Chip } from "../../../shared/components/primitives";
import { colors } from "../../../shared/theme";
import { ASSISTANT_INDENT } from "../../chat/chatStyles";

export const QuickReplies = ({ options, onPick, indent = true }) => (
  <div
    role="group"
    aria-label="Respostas rápidas"
    style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", paddingLeft: indent ? ASSISTANT_INDENT : 0 }}
  >
    {options.map((option) => (
      <Chip
        key={option}
        className="k-chip k-chat-chip"
        onClick={() => onPick(option)}
        style={{
          minHeight: 44,
          fontSize: "var(--font-size-md)",
          fontWeight: 500,
          color: colors.primaryText,
          background: colors.card,
          border: "1px solid var(--color-primary-tint)",
        }}
      >
        {option}
      </Chip>
    ))}
  </div>
);
