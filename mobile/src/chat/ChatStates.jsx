// Estados do chat: boas-vindas (vazio), carregando (esqueleto) e aviso de sem conexão · API: nenhuma
import { CHAT_AGENTS } from "@kira/shared/api/chatContract";
import { welcomeSuggestions } from "@kira/client/chat/chatContent";
import { WifiOff } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Heading, Stack, Text } from "../components/primitives";
import { SkeletonBlock } from "../components/states";
import { colors, radius } from "../theme";
import { AgentAvatar } from "./AgentAvatar";
import { QuickReplies } from "./QuickReplies";

export const ChatWelcome = ({ onPick }) => (
  <ScrollView
    contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 }}
  >
    <AgentAvatar agent={CHAT_AGENTS.AI} size={80} />
    <Heading size="3xl" style={{ textAlign: "center" }}>
      Oi, eu sou a Kira
    </Heading>
    <Text size="base" color={colors.mutedForeground} style={{ maxWidth: 290, textAlign: "center", lineHeight: 24 }}>
      Sou a nossa inteligência artificial e posso te ajudar a encontrar profissionais, agendar horários e tirar dúvidas.
    </Text>
    <Text size="xs" weight={600} color={colors.primaryText} style={{ letterSpacing: 1, textTransform: "uppercase" }}>
      beleza, tecnologia, confiança
    </Text>
    <Text size="sm" weight={600} style={{ marginTop: 8 }}>
      Por onde você quer começar?
    </Text>
    <QuickReplies options={welcomeSuggestions} onPick={onPick} indent={false} center />
  </ScrollView>
);

const SkeletonBubble = ({ width, align, lines }) => (
  <View
    style={{
      alignSelf: align,
      width,
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: radius["4xl"],
      backgroundColor: colors.muted,
    }}
  >
    {lines.map((line) => (
      <SkeletonBlock key={line} height={10} width={line} />
    ))}
  </View>
);

export const ChatSkeleton = () => (
  <Stack
    gap={14}
    justify="flex-end"
    accessibilityLabel="Carregando mensagens"
    style={{ flex: 1, padding: 16, overflow: "hidden" }}
  >
    <SkeletonBubble width="72%" align="flex-start" lines={["90%", "60%"]} />
    <SkeletonBubble width="56%" align="flex-end" lines={["100%", "45%"]} />
    <SkeletonBubble width="72%" align="flex-start" lines={["80%", "95%", "50%"]} />
  </Stack>
);

export const ConnectionBanner = () => (
  <View
    accessibilityLiveRegion="polite"
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.accent14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}
  >
    <WifiOff size={18} color={colors.foreground} />
    <Text size="sm" style={{ flex: 1, lineHeight: 18 }}>
      Você está sem conexão. Suas mensagens serão enviadas assim que a internet voltar.
    </Text>
  </View>
);
