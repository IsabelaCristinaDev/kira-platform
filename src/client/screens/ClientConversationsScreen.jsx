// Conversas da cliente com os estúdios, uma por agendamento · API: kira-backend (api.messages)
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { RealConversationList } from "../../shared/components/RealConversationList";
import { ScreenFrame } from "../../shared/components/ScreenFrame";

export default function ClientConversationsScreen() {
  const { setScreen } = useSession();
  const { setSelectedAppointmentId } = useScheduling();
  return (
    <ScreenFrame onBack={() => setScreen("clientProfile")} title="Conversas" subtitle="Suas conversas com os estúdios.">
      <RealConversationList
        onOpen={(id) => {
          setSelectedAppointmentId(id);
          setScreen("clientConversation");
        }}
      />
    </ScreenFrame>
  );
}
