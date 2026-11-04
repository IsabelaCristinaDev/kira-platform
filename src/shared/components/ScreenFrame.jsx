// Esqueleto das telas internas: cabeçalho com voltar, título, corpo com rolagem e rodapé opcional · API: nenhuma
import { colors, fontBody, fontDisplay } from "../theme";
import { Header } from "./ui";

export const ScreenFrame = ({ onBack, title, subtitle, footer, children }) => (
  <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
    {onBack && <Header onBack={onBack} />}
    <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-24)", overflowY: "auto" }}>
      <h1
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: "var(--font-size-2xl)",
          color: colors.foreground,
          margin: "var(--space-4) 0 var(--space-4)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
    {footer}
  </div>
);
