// Conversas do cliente com profissionais · demonstração visual, dados de exemplo
import { useConversations } from "../../context/ConversationsContext";
import { useSession } from "../../context/SessionContext";
import { ConversationList } from "../../shared/components/conversations";
import { DemoBanner } from "../../shared/components/demo";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { clientConversationsDemo } from "../../shared/data/demo";

export default function ClientConversationsScreen() {
  const { setScreen } = useSession();
  const { setSelectedConversationId } = useConversations();
  return (
    <ScreenFrame
      onBack={() => setScreen("clientProfile")}
      title="Conversas"
      subtitle="Suas conversas com profissionais."
    >
      <DemoBanner />
      <ConversationList
        items={clientConversationsDemo}
        onOpen={(c) => {
          setSelectedConversationId(c.id);
          setScreen("clientConversation");
        }}
      />
    </ScreenFrame>
  );
}
