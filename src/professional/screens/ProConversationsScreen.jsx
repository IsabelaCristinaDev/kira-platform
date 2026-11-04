// Conversas do profissional com clientes · demonstração visual, dados de exemplo
import { useConversations } from "../../context/ConversationsContext";
import { useSession } from "../../context/SessionContext";
import { ConversationList } from "../../shared/components/conversations";
import { DemoBanner } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { proConversationsDemo } from "../../shared/data/demo";

export default function ProConversationsScreen() {
  const { setScreen } = useSession();
  const { setSelectedConversationId } = useConversations();
  return (
    <ScreenFrame onBack={() => setScreen("proProfileMenu")} title="Conversas" subtitle="Suas conversas com clientes.">
      <DemoBanner />
      <ConversationList
        items={proConversationsDemo}
        onOpen={(c) => {
          setSelectedConversationId(c.id);
          setScreen("proConversation");
        }}
      />
    </ScreenFrame>
  );
}
