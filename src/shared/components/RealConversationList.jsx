// Lista de conversas reais (cliente ou estúdio) sobre os agendamentos · API: kira-backend (api.messages, via ConversationsContext)
import { useConversations } from "../../context/ConversationsContext";
import { errorMessage } from "../api";
import { dayLabel, formatTime } from "../utils/chatMessages";
import { ConversationList } from "./conversations";
import { ErrorState, SkeletonLoading } from "./states";

const timeOf = (iso) => (iso ? (dayLabel(iso) === "Hoje" ? formatTime(iso) : dayLabel(iso)) : "");

// Converte a linha do backend (toConversation) no formato da lista visual
const toItem = (c) => ({
  id: String(c.appointmentId),
  appointmentId: c.appointmentId,
  name: c.otherName,
  photo: c.otherPhoto,
  last: c.lastMessage ? `${c.lastMessageMine ? "Você: " : ""}${c.lastMessage}` : (c.service ?? ""),
  time: timeOf(c.lastMessageAt),
  unread: c.unread ?? 0,
});

export function RealConversationList({ onOpen }) {
  const { conversations, isLoading, error, refetch } = useConversations();
  if (isLoading) return <SkeletonLoading count={3} />;
  if (error)
    return <ErrorState onRetry={refetch} message={errorMessage(error, "Não foi possível carregar as conversas.")} />;
  return <ConversationList items={conversations.map(toItem)} onOpen={(c) => onOpen(c.appointmentId)} />;
}
