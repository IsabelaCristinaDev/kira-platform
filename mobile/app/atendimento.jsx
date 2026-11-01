// Atendimento: chat com a nossa inteligência artificial e transferência para atendente · mock (api.chat)
import { useScheduling } from "@kira/context/SchedulingContext";
import { CHAT_AGENTS, CHAT_STATUS, HANDOFF_STATES } from "@kira/shared/api/chatContract";
import { inputPlaceholder } from "@kira/client/chat/chatContent";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatHeader } from "../src/chat/ChatHeader";
import { ChatInput } from "../src/chat/ChatInput";
import { ChatSkeleton, ChatWelcome, ConnectionBanner } from "../src/chat/ChatStates";
import { HandoffButton } from "../src/chat/HandoffBanner";
import { MessageList } from "../src/chat/MessageList";
import { ErrorState } from "../src/components/states";
import { useChat } from "../src/hooks/useChat";
import { colors } from "../src/theme";

export default function ChatScreen() {
  const router = useRouter();
  const { setSelectedProId, resetScheduling } = useScheduling();
  const chat = useChat();
  const { status, messages, agent, handoff, typing, online } = chat;

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/(tabs)"));
  const openProfessional = (pro) => {
    setSelectedProId(pro.id);
    resetScheduling();
    router.push(`/profissional/${pro.id}`);
  };

  const waiting = handoff === HANDOFF_STATES.WAITING;
  const canAskHuman = agent === CHAT_AGENTS.AI && handoff === HANDOFF_STATES.NONE && messages.length > 0;
  const showWelcome = status === CHAT_STATUS.READY && messages.length === 0;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ChatHeader agent={agent} handoff={handoff} typing={typing} online={online} onBack={goBack} />
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
          <View
            style={{
              gap: 8,
              paddingTop: 8,
              paddingHorizontal: 12,
              paddingBottom: 12,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            {canAskHuman && <HandoffButton onPress={chat.requestHandoff} />}
            <ChatInput
              onSend={chat.send}
              disabled={waiting}
              placeholder={inputPlaceholder(agent === CHAT_AGENTS.HUMAN)}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
