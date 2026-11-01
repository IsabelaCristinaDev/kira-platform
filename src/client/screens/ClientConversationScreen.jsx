// Conversa da cliente com o estúdio sobre um agendamento · API: kira-backend (api.messages)
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { AppointmentChatScreen } from "../../shared/components/AppointmentChatScreen";
import { useMyAppointments } from "../hooks/useProfessionals";

export default function ClientConversationScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const appointments = useMyAppointments();
  return (
    <AppointmentChatScreen
      appointments={appointments}
      appointmentId={selectedAppointmentId}
      otherNameOf={(a) => a.proName}
      onBack={() => setScreen("clientAgendaDetail")}
      onNotFound={() => setScreen("clientAgenda")}
    />
  );
}
