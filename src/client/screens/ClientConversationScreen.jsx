// Conversa do cliente com uma profissional · demonstração visual, dados de exemplo
import { useConversations } from "../../context/ConversationsContext";
import { useSession } from "../../context/SessionContext";
import { ConversationPage } from "../../shared/components/ConversationPage";
import { clientConversationsDemo } from "../../shared/data/demo";

export default function ClientConversationScreen() {
  const { setScreen } = useSession();
  const { selectedConversationId } = useConversations();
  const contact = clientConversationsDemo.find((c) => c.id === selectedConversationId) ?? clientConversationsDemo[0];
  return <ConversationPage contact={contact} onBack={() => setScreen("clientConversations")} />;
}
