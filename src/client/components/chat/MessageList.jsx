// Lista de mensagens do chat: agrupada por dia, com rolagem automática para a última mensagem · API: nenhuma
import { Fragment, useEffect, useMemo, useRef } from "react";
import { HANDOFF_STATES, MESSAGE_TYPES } from "../../../shared/api/chatContract";
import { Text } from "../../../shared/components/primitives";
import { colors } from "../../../shared/theme";
import { groupMessagesByDay } from "../../chat/chatMessages";
import { ProfessionalCard } from "../ProfessionalCards";
import { HandoffBanner } from "./HandoffBanner";
import { AssistantRow, MessageBubble } from "./MessageBubble";
import { QuickReplies } from "./QuickReplies";
import { ScheduleCard } from "./ScheduleCard";
import { TypingIndicator } from "./TypingIndicator";

const DayLabel = ({ label }) => (
  <Text
    as="div"
    size="xs"
    weight={500}
    color={colors.mutedForeground}
    style={{
      alignSelf: "center",
      padding: "var(--space-5) var(--space-12)",
      borderRadius: "var(--radius-pill)",
      background: colors.muted,
    }}
  >
    {label}
  </Text>
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
  const endRef = useRef(null);
  const lastId = messages.at(-1)?.id;
  // respostas rápidas só valem enquanto são a última coisa da conversa
  const visible = useMemo(
    () => messages.filter((m) => m.type !== MESSAGE_TYPES.QUICK_REPLIES || m.id === lastId),
    [messages, lastId],
  );
  const groups = useMemo(() => groupMessagesByDay(visible), [visible]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" });
  }, [messages, typing, handoff]);

  const renderMessage = (message) => {
    const isLast = message.id === lastId;
    switch (message.type) {
      case MESSAGE_TYPES.QUICK_REPLIES:
        return <QuickReplies options={message.options} onPick={onSend} />;
      case MESSAGE_TYPES.PROFESSIONAL:
        return (
          <AssistantRow author={message.author} showAvatar={false} wide>
            <ProfessionalCard pro={message.professional} onClick={() => onOpenProfessional(message.professional)} />
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
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversa com o atendimento Kira"
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-12)",
        padding: "var(--space-16)",
      }}
    >
      <div style={{ flex: "1 1 auto" }} aria-hidden="true" />
      {groups.map((group) => (
        <Fragment key={group.key}>
          <DayLabel label={group.label} />
          {group.messages.map((message) => (
            <div key={message.id} className="k-chat-in" style={{ display: "flex", flexDirection: "column" }}>
              {renderMessage(message)}
            </div>
          ))}
        </Fragment>
      ))}
      {typing && <TypingIndicator agent={agent} />}
      {handoff === HANDOFF_STATES.WAITING && <HandoffBanner onCancel={onCancelHandoff} />}
      <div ref={endRef} />
    </div>
  );
};
