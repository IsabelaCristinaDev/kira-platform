// Cabeçalho do chat: voltar, avatar, nome, status e faixa que mostra quem está atendendo (IA ou humano) · API: nenhuma
import { CHAT_AGENTS, HANDOFF_STATES } from "@kira/shared/api/chatContract";
import { Headset, Loader2, Sparkles } from "lucide-react-native";
import { View } from "react-native";
import { BackButton } from "../components/ui";
import { Heading, Text } from "../components/primitives";
import { colors } from "../theme";
import { Spinner } from "./Spinner";
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
      background: colors.accent14,
    };
  }
  if (agent === CHAT_AGENTS.HUMAN) {
    return { Icon: Headset, text: "Você está falando com um atendente", background: colors.primary12 };
  }
  return { Icon: Sparkles, text: "Você está falando com a nossa inteligência artificial", background: colors.lilac };
};

// faixa abaixo do cabeçalho: cor e ícone diferentes para IA, espera e atendente
export const AgentStrip = ({ agent, handoff }) => {
  const { Icon, spin, text, background } = stripOf({ agent, handoff });
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 9,
        paddingHorizontal: 16,
        backgroundColor: background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {spin ? (
        <Spinner>
          <Icon size={14} color={colors.foreground} />
        </Spinner>
      ) : (
        <Icon size={14} color={colors.foreground} />
      )}
      <Text size="xs" style={{ flex: 1, lineHeight: 16 }}>
        {text}
      </Text>
    </View>
  );
};

export const ChatHeader = ({ agent, handoff, typing, online, onBack }) => {
  const human = agent === CHAT_AGENTS.HUMAN;
  const status = statusOf({ online, handoff, typing });
  const dot = status.dot ?? (human ? colors.primary : colors.violet);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 10,
          paddingLeft: 8,
          paddingRight: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <BackButton onPress={onBack} />
        <AgentAvatar agent={agent} />
        <View style={{ gap: 2, flex: 1 }}>
          <Heading size="lg">{human ? "Equipe Kira" : "Kira"}</Heading>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} />
            <Text size="xs" color={colors.mutedForeground} accessibilityLiveRegion="polite">
              {status.text}
            </Text>
          </View>
        </View>
      </View>
      <AgentStrip agent={agent} handoff={handoff} />
    </View>
  );
};
