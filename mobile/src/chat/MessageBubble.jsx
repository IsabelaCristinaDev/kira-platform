// Bolhas do chat: usuário (gradiente), IA e atendente (superfície clara) e mensagem de sistema · API: nenhuma
import { AUTHORS, CHAT_AGENTS, DELIVERY, MESSAGE_TYPES } from "@kira/shared/api/chatContract";
import { formatTime } from "@kira/client/chat/chatMessages";
import { CircleAlert, Clock, RotateCw } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { GradientBox, Text } from "../components/primitives";
import { colors, radius } from "../theme";
import { AgentAvatar } from "./AgentAvatar";

export const ASSISTANT_INDENT = 36;

const SystemMessage = ({ text }) => (
  <View
    style={{
      alignSelf: "center",
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: radius.pill,
      backgroundColor: colors.muted,
    }}
  >
    <Text size="sm" color={colors.mutedForeground} style={{ textAlign: "center", lineHeight: 17 }}>
      {text}
    </Text>
  </View>
);

const DeliveryNote = ({ message, onRetry }) => {
  if (message.delivery === DELIVERY.FAILED) {
    return (
      <View style={{ alignItems: "flex-end", gap: 8 }} accessibilityRole="alert">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <CircleAlert size={16} color={colors.primaryText} />
          <Text size="sm" weight={500} color={colors.primaryText}>
            Não foi possível enviar sua mensagem
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onRetry(message.id)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            minHeight: 44,
            paddingHorizontal: 16,
            borderRadius: radius.pill,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.primaryTint,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <RotateCw size={16} color={colors.primaryText} />
          <Text size="md" weight={600} color={colors.primaryText}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }
  if (message.delivery === DELIVERY.QUEUED) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Clock size={14} color={colors.mutedForeground} />
        <Text size="sm" color={colors.mutedForeground}>
          Aguardando conexão para enviar
        </Text>
      </View>
    );
  }
  if (message.delivery === DELIVERY.SENDING) {
    return (
      <Text size="xs" color={colors.mutedForeground}>
        Enviando...
      </Text>
    );
  }
  return (
    <Text size="xs" color={colors.mutedForeground}>
      {formatTime(message.createdAt)}
    </Text>
  );
};

const corner = (r) => ({
  borderTopLeftRadius: r,
  borderTopRightRadius: r,
  borderBottomLeftRadius: r,
  borderBottomRightRadius: r,
});

const UserBubble = ({ message, onRetry }) => {
  const notSent = message.delivery === DELIVERY.FAILED || message.delivery === DELIVERY.QUEUED;
  const bubble = {
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...corner(radius["4xl"]),
    borderBottomRightRadius: radius.xs,
  };
  const text = (
    <Text size="base" weight={500} color={notSent ? colors.foreground : colors.white} style={{ lineHeight: 22 }}>
      {message.text}
    </Text>
  );
  return (
    <View style={{ alignSelf: "flex-end", maxWidth: "80%", alignItems: "flex-end", gap: 4 }}>
      {notSent ? (
        <View
          style={[
            bubble,
            { backgroundColor: colors.primary12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.primary },
          ]}
        >
          {text}
        </View>
      ) : (
        <GradientBox style={bubble}>{text}</GradientBox>
      )}
      <DeliveryNote message={message} onRetry={onRetry} />
    </View>
  );
};

// linha da IA ou do atendente: avatar, nome, conteúdo e hora; `wide` libera a largura para cartões
export const AssistantRow = ({ author, authorName, time, showAvatar = true, wide, children }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      alignSelf: "flex-start",
      maxWidth: wide ? "100%" : "88%",
      width: wide ? "100%" : undefined,
    }}
  >
    {showAvatar ? (
      <AgentAvatar agent={author === AUTHORS.HUMAN ? CHAT_AGENTS.HUMAN : CHAT_AGENTS.AI} size={28} />
    ) : (
      <View style={{ width: ASSISTANT_INDENT - 8 }} />
    )}
    <View style={{ gap: 4, flexShrink: 1, flex: wide ? 1 : undefined }}>
      {authorName && (
        <Text size="xs" weight={600} color={colors.mutedForeground} style={{ paddingLeft: 4 }}>
          {authorName}
        </Text>
      )}
      {children}
      {time && (
        <Text size="xs" color={colors.mutedForeground}>
          {time}
        </Text>
      )}
    </View>
  </View>
);

const AssistantBubble = ({ message }) => (
  <AssistantRow author={message.author} authorName={message.authorName} time={formatTime(message.createdAt)}>
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        ...corner(radius["4xl"]),
        borderBottomLeftRadius: radius.xs,
        backgroundColor: message.author === AUTHORS.HUMAN ? colors.surfaceSoft : colors.card,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text size="base" style={{ lineHeight: 22 }}>
        {message.text}
      </Text>
    </View>
  </AssistantRow>
);

// texto, sistema, usuário, IA ou atendente; os cartões e as respostas rápidas ficam em MessageList
export const MessageBubble = ({ message, onRetry }) => {
  if (message.type === MESSAGE_TYPES.SYSTEM) return <SystemMessage text={message.text} />;
  if (message.author === AUTHORS.USER) return <UserBubble message={message} onRetry={onRetry} />;
  return <AssistantBubble message={message} />;
};
