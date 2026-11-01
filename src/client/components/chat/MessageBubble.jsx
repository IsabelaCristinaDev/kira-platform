// Bolhas do chat: usuário (gradiente), IA e atendente (superfície clara) e mensagem de sistema · API: nenhuma
import { CircleAlert, Clock, RotateCw } from "lucide-react";
import { AUTHORS, CHAT_AGENTS, DELIVERY, MESSAGE_TYPES } from "../../../shared/api/chatContract";
import { Chip, Text } from "../../../shared/components/primitives";
import { colors, gradientKira } from "../../../shared/theme";
import { formatTime } from "../../chat/chatMessages";
import { ASSISTANT_INDENT, bubbleText, ON_GRADIENT } from "../../chat/chatStyles";
import { AgentAvatar } from "./AgentAvatar";

const muted = { size: "xs", color: colors.mutedForeground };

const SystemMessage = ({ text }) => (
  <Text
    as="div"
    size="sm"
    color={colors.mutedForeground}
    style={{
      alignSelf: "center",
      textAlign: "center",
      padding: "var(--space-6) var(--space-14)",
      borderRadius: "var(--radius-pill)",
      background: colors.muted,
      lineHeight: 1.3,
    }}
  >
    {text}
  </Text>
);

const DeliveryNote = ({ message, onRetry }) => {
  if (message.delivery === DELIVERY.FAILED) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-8)" }}>
        <Text
          as="div"
          size="sm"
          weight={500}
          color={colors.primaryText}
          role="alert"
          style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}
        >
          <CircleAlert size={16} aria-hidden="true" /> Não foi possível enviar sua mensagem
        </Text>
        <Chip
          className="k-chip k-chat-chip"
          onClick={() => onRetry(message.id)}
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-8)",
            fontSize: "var(--font-size-md)",
            color: colors.primaryText,
            background: colors.card,
            border: "1px solid var(--color-primary-tint)",
          }}
        >
          <RotateCw size={16} aria-hidden="true" /> Tentar novamente
        </Chip>
      </div>
    );
  }
  if (message.delivery === DELIVERY.QUEUED) {
    return (
      <Text
        as="div"
        size="sm"
        color={colors.mutedForeground}
        style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}
      >
        <Clock size={14} aria-hidden="true" /> Aguardando conexão para enviar
      </Text>
    );
  }
  if (message.delivery === DELIVERY.SENDING)
    return (
      <Text as="span" {...muted}>
        Enviando...
      </Text>
    );
  return (
    <Text as="span" {...muted}>
      {formatTime(message.createdAt)}
    </Text>
  );
};

const UserBubble = ({ message, onRetry }) => {
  const notSent = message.delivery === DELIVERY.FAILED || message.delivery === DELIVERY.QUEUED;
  return (
    <div
      style={{
        alignSelf: "flex-end",
        maxWidth: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "var(--space-4)",
      }}
    >
      <div
        style={{
          ...bubbleText,
          fontWeight: 500,
          padding: "var(--space-12) var(--space-16)",
          borderRadius: "var(--radius-4xl) var(--radius-4xl) var(--radius-xs) var(--radius-4xl)",
          background: notSent ? "hsl(var(--primary-hsl) / 0.12)" : gradientKira,
          color: notSent ? colors.foreground : ON_GRADIENT,
          border: notSent ? `1px dashed ${colors.primary}` : "none",
        }}
      >
        {message.text}
      </div>
      <DeliveryNote message={message} onRetry={onRetry} />
    </div>
  );
};

// linha da IA ou do atendente: avatar, nome, conteúdo e hora; `wide` libera a largura para cartões
export const AssistantRow = ({ author, authorName, time, showAvatar = true, wide, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: "var(--space-8)",
      alignSelf: "flex-start",
      maxWidth: wide ? "100%" : "88%",
      width: wide ? "100%" : undefined,
    }}
  >
    {showAvatar ? (
      <AgentAvatar agent={author === AUTHORS.HUMAN ? CHAT_AGENTS.HUMAN : CHAT_AGENTS.AI} size={28} />
    ) : (
      <div style={{ width: ASSISTANT_INDENT - 8, flexShrink: 0 }} aria-hidden="true" />
    )}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        minWidth: 0,
        flex: wide ? 1 : undefined,
      }}
    >
      {authorName && (
        <Text as="span" size="xs" weight={600} color={colors.mutedForeground} style={{ paddingLeft: "var(--space-4)" }}>
          {authorName}
        </Text>
      )}
      {children}
      {time && (
        <Text as="span" {...muted}>
          {time}
        </Text>
      )}
    </div>
  </div>
);

const AssistantBubble = ({ message }) => (
  <AssistantRow author={message.author} authorName={message.authorName} time={formatTime(message.createdAt)}>
    <div
      style={{
        ...bubbleText,
        padding: "var(--space-12) var(--space-16)",
        borderRadius: "var(--radius-4xl) var(--radius-4xl) var(--radius-4xl) var(--radius-xs)",
        background: message.author === AUTHORS.HUMAN ? "var(--color-surface-soft)" : colors.card,
        border: `1px solid ${colors.border}`,
        color: colors.foreground,
      }}
    >
      {message.text}
    </div>
  </AssistantRow>
);

// texto, sistema, usuário, IA ou atendente; os cartões e as respostas rápidas ficam em MessageList
export const MessageBubble = ({ message, onRetry }) => {
  if (message.type === MESSAGE_TYPES.SYSTEM) return <SystemMessage text={message.text} />;
  if (message.author === AUTHORS.USER) return <UserBubble message={message} onRetry={onRetry} />;
  return <AssistantBubble message={message} />;
};
