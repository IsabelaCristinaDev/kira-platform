// Avisos de demonstração visual: faixa fixa da tela e mensagem ao tocar numa ação ainda sem função · API: nenhuma
import { Info } from "lucide-react";
import { colors, fontBody } from "../theme";

export const DEMO_UNAVAILABLE = "Esta ação ainda não está disponível. Esta tela é uma demonstração visual.";

export const DemoBanner = ({
  children = "Demonstração visual: o conteúdo é de exemplo e ainda não funciona de verdade.",
}) => (
  <div
    role="note"
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-8)",
      padding: "var(--space-10) var(--space-12)",
      borderRadius: "var(--radius-lg)",
      background: "var(--color-lilac)",
      border: `1px solid ${colors.border}`,
      marginBottom: "var(--space-16)",
    }}
  >
    <Info size={15} color={colors.mutedForeground} aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }} />
    <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.foreground, lineHeight: 1.4 }}>
      {children}
    </span>
  </div>
);

// Mostrada quando a pessoa toca numa ação sem função: nunca simula que deu certo
export const DemoNotice = ({ show }) => (
  <p
    role="status"
    style={{
      fontFamily: fontBody,
      fontSize: "var(--font-size-xs)",
      fontWeight: 600,
      color: colors.mutedForeground,
      textAlign: "center",
      margin: "var(--space-10) 0 0",
      minHeight: "1.4em",
    }}
  >
    {show ? DEMO_UNAVAILABLE : ""}
  </p>
);
