// Conversa do cliente com uma profissional · demonstração visual, dados de exemplo
import { useConversations } from "../../context/ConversationsContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { ConversationPage } from "../../shared/components/ConversationPage";
import { clientConversationsDemo } from "../../shared/data/demo";

export default function ClientConversationScreen() {
  const { setScreen } = useSession();
  const { setSelectedProId, resetScheduling } = useScheduling();
  const { selectedConversationId } = useConversations();
  const contact = clientConversationsDemo.find((c) => c.id === selectedConversationId) ?? clientConversationsDemo[0];
  const go = (screen) => () => {
    setSelectedProId(contact.proId);
    if (screen === "clientScheduling") resetScheduling();
    setScreen(screen);
  };
  return (
    <ConversationPage
      contact={contact}
      onBack={() => setScreen("clientConversations")}
      actions={[
        { label: "Ver perfil", onClick: go("clientProfessionalProfile") },
        { label: "Agendar", onClick: go("clientScheduling") },
      ]}
    />
  );
}
