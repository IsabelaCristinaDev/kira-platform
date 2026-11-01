// Cabeçalho do chat: voltar, avatar, nome, status e faixa que mostra quem está atendendo (IA ou humano) · API: nenhuma
import { ArrowLeft, Headset, Loader2, Sparkles } from "lucide-react";
import { CHAT_AGENTS, HANDOFF_STATES } from "../../../shared/api/chatContract";
import { Heading, Text } from "../../../shared/components/primitives";
import { colors } from "../../../shared/theme";
import { AgentAvatar } from "./AgentAvatar";

const statusOf = ({ online, handoff, typing }) => {
  if (!online) return { text: "sem conexão", dot: colors.mutedForeground };
  if (handoff === HANDOFF_STATES.WAITING) return { text: "conectando você a um atendente", dot: colors.accent };
  return { text: typing ? "digitando..." : "online", dot: null };
};

const stripOf = ({ agent, handoff }) => {
  if (handoff === HANDOFF_STATES.WAITING) {
    return {
      Icon: Loader2,
      spin: true,
      text: "Aguardando um atendente entrar na conversa",
      background: "hsl(var(--accent-hsl) / 0.14)",
    };
  }
  if (agent === CHAT_AGENTS.HUMAN) {
    return {
      Icon: Headset,
      text: "Você está falando com um atendente",
      background: "hsl(var(--primary-hsl) / 0.12)",
    };
  }
  return {
    Icon: Sparkles,
    text: "Você está falando com a nossa inteligência artificial",
    background: "var(--color-lilac)",
  };
};

// faixa abaixo do cabeçalho: cor e ícone diferentes para IA, espera e atendente
export const AgentStrip = ({ agent, handoff }) => {
  const { Icon, spin, text, background } = stripOf({ agent, handoff });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-8)",
        padding: "var(--space-9) var(--space-16)",
        background,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Icon size={14} color={colors.foreground} aria-hidden="true" className={spin ? "k-chat-spin" : undefined} />
      <Text as="span" size="xs" style={{ lineHeight: 1.3 }}>
        {text}
      </Text>
    </div>
  );
};

export const ChatHeader = ({ agent, handoff, typing, online, onBack }) => {
  const human = agent === CHAT_AGENTS.HUMAN;
  const status = statusOf({ online, handoff, typing });
  const dot = status.dot ?? (human ? colors.primary : "var(--color-violet)");
  return (
    <header>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-10)",
          padding: "var(--space-12) var(--space-16) var(--space-12) var(--space-8)",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <button
          type="button"
          className="k-chip"
          onClick={onBack}
          aria-label="Voltar"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-round)",
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.foreground,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <AgentAvatar agent={agent} />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", minWidth: 0 }}>
          <Heading as="h1" size="lg" style={{ lineHeight: 1.15 }}>
            {human ? "Equipe Kira" : "Kira"}
          </Heading>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: "var(--radius-round)", background: dot, flexShrink: 0 }}
            />
            <Text as="span" size="xs" color={colors.mutedForeground} role="status">
              {status.text}
            </Text>
          </div>
        </div>
      </div>
      <AgentStrip agent={agent} handoff={handoff} />
    </header>
  );
};
