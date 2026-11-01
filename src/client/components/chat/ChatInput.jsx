// Campo de texto do chat: arredondado, envia com Enter ou pelo botão com gradiente · API: nenhuma
import { Send } from "lucide-react";
import { useId, useState } from "react";
import { colors, fontBody, gradientKira } from "../../../shared/theme";
import { ON_GRADIENT } from "../../chat/chatStyles";

export const ChatInput = ({ onSend, disabled, placeholder }) => {
  const [value, setValue] = useState("");
  const id = useId();
  const empty = !value.trim();

  const submit = (event) => {
    event.preventDefault();
    if (empty || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-8)",
        minHeight: 52,
        padding: "0 var(--space-4) 0 var(--space-18)",
        borderRadius: "var(--radius-pill)",
        background: colors.muted,
        border: `1px solid ${colors.border}`,
        boxSizing: "border-box",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <label htmlFor={id} className="k-sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          background: "transparent",
          fontFamily: fontBody,
          fontSize: "var(--font-size-base)",
          color: colors.foreground,
        }}
      />
      <button
        type="submit"
        className="k-btn"
        aria-label="Enviar mensagem"
        disabled={empty || disabled}
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-round)",
          border: "none",
          background: empty || disabled ? "var(--color-primary-tint)" : gradientKira,
          color: empty || disabled ? colors.foreground : ON_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: empty || disabled ? "not-allowed" : "pointer",
        }}
      >
        <Send size={20} aria-hidden="true" />
      </button>
    </form>
  );
};
