// Transferência para atendente: botão "Falar com atendente" e cartão de espera com cancelar · API: nenhuma
import { Headset, Loader2 } from "lucide-react";
import { Chip, Heading, Text } from "../../../shared/components/primitives";
import { colors } from "../../../shared/theme";

export const HandoffButton = ({ onClick }) => (
  <Chip
    className="k-chip k-chat-chip"
    onClick={onClick}
    style={{
      minHeight: 44,
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-8)",
      fontSize: "var(--font-size-md)",
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    }}
  >
    <Headset size={18} aria-hidden="true" /> Falar com atendente
  </Chip>
);

export const HandoffBanner = ({ onCancel }) => (
  <div
    role="status"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
      padding: "var(--space-16)",
      borderRadius: "var(--radius-4xl)",
      background: "var(--color-surface-soft)",
      border: `1px solid ${colors.border}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-14)" }}>
      <div
        aria-hidden="true"
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-round)",
          background: colors.card,
          boxShadow: "var(--shadow-card-glow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Loader2 size={22} color={colors.primaryText} className="k-chat-spin" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Heading as="h2" size="md" style={{ fontFamily: "var(--font-body)", lineHeight: 1.3 }}>
          Conectando você a um atendente...
        </Heading>
        <Text size="sm" color={colors.mutedForeground} style={{ lineHeight: 1.45 }}>
          A resposta chega aqui mesmo, neste chat. Se você sair, avisamos por notificação quando alguém entrar.
        </Text>
      </div>
    </div>
    <button
      type="button"
      className="k-reset"
      onClick={onCancel}
      style={{
        minHeight: 44,
        alignSelf: "center",
        padding: "0 var(--space-16)",
        fontFamily: "var(--font-body)",
        fontSize: "var(--font-size-md)",
        fontWeight: 600,
        color: colors.primaryText,
        cursor: "pointer",
      }}
    >
      Cancelar e voltar para a nossa inteligência artificial
    </button>
  </div>
);
