// Conversa do profissional com um cliente · demonstração visual, dados de exemplo
import { useConversations } from "../../context/ConversationsContext";
import { useSession } from "../../context/SessionContext";
import { ConversationPage } from "../../shared/components/ConversationPage";
import { proConversationsDemo } from "../../shared/data/demo";

export default function ProConversationScreen() {
  const { setScreen } = useSession();
  const { selectedConversationId } = useConversations();
  const contact = proConversationsDemo.find((c) => c.id === selectedConversationId) ?? proConversationsDemo[0];
  return <ConversationPage contact={contact} onBack={() => setScreen("proConversations")} />;
}
