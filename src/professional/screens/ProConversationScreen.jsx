// Conversa do estúdio com a cliente sobre um atendimento · API: kira-backend (api.messages)
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { AppointmentChatScreen } from "../../shared/components/AppointmentChatScreen";
import { useBusinessAppointments } from "../hooks/useBusinessData";

export default function ProConversationScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const appointments = useBusinessAppointments();
  const toAgenda = () => setScreen("proAgendaDash");
  return (
    <AppointmentChatScreen
      appointments={appointments}
      appointmentId={selectedAppointmentId}
      otherNameOf={(a) => a.clientName}
      onBack={toAgenda}
      onNotFound={toAgenda}
    />
  );
}
