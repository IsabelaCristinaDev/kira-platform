// Folha inferior (modal) dentro do quadro do app: fecha com Esc, toque fora ou no X · API: nenhuma
import { X } from "lucide-react";
import { colors, fontDisplay } from "../theme";
import { EscapeKey } from "./primitives";

export const Sheet = ({ title, onClose, children }) => (
  <div
    role="presentation"
    onClick={(e) => e.target === e.currentTarget && onClose()}
    style={{
      position: "absolute",
      inset: 0,
      background: "hsl(var(--foreground-hsl) / 0.45)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      zIndex: 50,
    }}
  >
    <EscapeKey onEscape={onClose} />
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        width: "100%",
        maxHeight: "88%",
        overflowY: "auto",
        boxSizing: "border-box",
        background: colors.card,
        borderRadius: "var(--radius-sheet) var(--radius-sheet) 0 0",
        padding: "var(--space-12) var(--space-24) var(--space-28)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 4,
          borderRadius: "var(--radius-2xs)",
          background: colors.border,
          margin: "0 auto var(--space-12)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-12)" }}>
        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-xl)",
            color: colors.foreground,
            margin: 0,
          }}
        >
          {title}
        </h2>
        <button
          type="button"
          className="k-chip k-hit"
          aria-label="Fechar"
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-round)",
            border: "none",
            background: colors.muted,
            color: colors.foreground,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div style={{ marginTop: "var(--space-16)" }}>{children}</div>
    </div>
  </div>
);
