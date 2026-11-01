// Atendimento: chat com a nossa inteligência artificial e transferência para atendente · mock (api.chat)
import { CHAT_AGENTS, CHAT_STATUS, HANDOFF_STATES } from "../../shared/api/chatContract";
import { ErrorState } from "../../shared/components/states";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { colors } from "../../shared/theme";
import { chatMotionCss } from "../chat/chatStyles";
import { inputPlaceholder } from "../chat/chatContent";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatSkeleton, ChatWelcome, ConnectionBanner } from "../components/chat/ChatStates";
import { HandoffButton } from "../components/chat/HandoffBanner";
import { MessageList } from "../components/chat/MessageList";
import { useChat } from "../hooks/useChat";

export default function ClientChatScreen() {
  const { setScreen } = useSession();
  const { setSelectedProId } = useScheduling();
  const chat = useChat();
  const { status, messages, agent, handoff, typing, online } = chat;

  const openProfessional = (pro) => {
    setSelectedProId(pro.id);
    setScreen("clientProfessionalProfile");
  };

  const waiting = handoff === HANDOFF_STATES.WAITING;
  const canAskHuman = agent === CHAT_AGENTS.AI && handoff === HANDOFF_STATES.NONE && messages.length > 0;
  const showWelcome = status === CHAT_STATUS.READY && messages.length === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 780,
        maxHeight: "100dvh",
        background: colors.background,
      }}
    >
      <style>{chatMotionCss}</style>
      <ChatHeader
        agent={agent}
        handoff={handoff}
        typing={typing}
        online={online}
        onBack={() => setScreen("clientHelpSupport")}
      />
      {!online && <ConnectionBanner />}
      {status === CHAT_STATUS.LOADING && <ChatSkeleton />}
      {status === CHAT_STATUS.ERROR && (
        <ErrorState message="Não foi possível abrir o atendimento agora." onRetry={chat.reload} />
      )}
      {showWelcome && <ChatWelcome onPick={chat.send} />}
      {status === CHAT_STATUS.READY && !showWelcome && (
        <MessageList
          messages={messages}
          typing={typing}
          agent={agent}
          handoff={handoff}
          onRetry={chat.retry}
          onSend={chat.send}
          onOpenProfessional={openProfessional}
          onCancelHandoff={chat.cancelHandoff}
        />
      )}
      {status === CHAT_STATUS.READY && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-8)",
            padding: "var(--space-8) var(--space-12) calc(var(--space-12) + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          {canAskHuman && (
            <div>
              <HandoffButton onClick={chat.requestHandoff} />
            </div>
          )}
          <ChatInput
            onSend={chat.send}
            disabled={waiting}
            placeholder={inputPlaceholder(agent === CHAT_AGENTS.HUMAN)}
          />
        </div>
      )}
    </div>
  );
}
