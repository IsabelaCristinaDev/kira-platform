// Lista de mensagens do chat: agrupada por dia, com rolagem automática para a última mensagem · API: nenhuma
import { HANDOFF_STATES, MESSAGE_TYPES } from "@kira/shared/api/chatContract";
import { groupMessagesByDay } from "@kira/client/chat/chatMessages";
import { Fragment, useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../components/primitives";
import { ProfessionalCard } from "../components/ui";
import { colors, radius } from "../theme";
import { HandoffBanner } from "./HandoffBanner";
import { AssistantRow, MessageBubble } from "./MessageBubble";
import { QuickReplies } from "./QuickReplies";
import { ScheduleCard } from "./ScheduleCard";
import { TypingIndicator } from "./TypingIndicator";

const DayLabel = ({ label }) => (
  <View
    style={{
      alignSelf: "center",
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: colors.muted,
    }}
  >
    <Text size="xs" weight={500} color={colors.mutedForeground}>
      {label}
    </Text>
  </View>
);

export const MessageList = ({
  messages,
  typing,
  agent,
  handoff,
  onRetry,
  onSend,
  onOpenProfessional,
  onCancelHandoff,
}) => {
  const scroller = useRef(null);
  const lastId = messages.at(-1)?.id;
  // respostas rápidas só valem enquanto são a última coisa da conversa
  const visible = useMemo(
    () => messages.filter((m) => m.type !== MESSAGE_TYPES.QUICK_REPLIES || m.id === lastId),
    [messages, lastId],
  );
  const groups = useMemo(() => groupMessagesByDay(visible), [visible]);

  const renderMessage = (message) => {
    const isLast = message.id === lastId;
    switch (message.type) {
      case MESSAGE_TYPES.QUICK_REPLIES:
        return <QuickReplies options={message.options} onPick={onSend} />;
      case MESSAGE_TYPES.PROFESSIONAL:
        return (
          <AssistantRow author={message.author} showAvatar={false} wide>
            <ProfessionalCard pro={message.professional} onPress={() => onOpenProfessional(message.professional)} />
          </AssistantRow>
        );
      case MESSAGE_TYPES.SCHEDULING:
        return (
          <AssistantRow author={message.author} showAvatar={false} wide>
            <ScheduleCard
              suggestion={message.suggestion}
              disabled={!isLast}
              onConfirm={() => onSend("Confirmar horário")}
              onOther={() => onSend("Outro horário")}
            />
          </AssistantRow>
        );
      default:
        return <MessageBubble message={message} onRetry={onRetry} />;
    }
  };

  return (
    <ScrollView
      ref={scroller}
      accessibilityLabel="Conversa com o atendimento Kira"
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", gap: 12, padding: 16 }}
    >
      {groups.map((group) => (
        <Fragment key={group.key}>
          <DayLabel label={group.label} />
          {group.messages.map((message) => (
            <View key={message.id}>{renderMessage(message)}</View>
          ))}
        </Fragment>
      ))}
      {typing && <TypingIndicator agent={agent} />}
      {handoff === HANDOFF_STATES.WAITING && <HandoffBanner onCancel={onCancelHandoff} />}
    </ScrollView>
  );
};
