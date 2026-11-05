// Remarcar da cliente, até 2 horas antes · API: kira-backend (PATCH /api/agendamentos/{id}/reagendar/cliente)
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";
import { RescheduleScreen } from "../../shared/components/RescheduleScreen";
import { useMyAppointments } from "../hooks/useProfessionals";

export default function ClientRescheduleScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const appointments = useMyAppointments();
  return (
    <RescheduleScreen
      appointments={appointments}
      appointmentId={selectedAppointmentId}
      reschedule={api.appointments.reschedule}
      summary={(a) => `${a.service} com ${a.proName}`}
      doneLabel="Ver agendamento"
      onBack={() => setScreen("clientAgendaDetail")}
      onNotFound={() => setScreen("clientAgenda")}
    />
  );
}
