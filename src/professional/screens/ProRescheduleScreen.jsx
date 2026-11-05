// Remarcar do estúdio, sem o limite de 2 horas da cliente · API: kira-backend (PATCH /api/agendamentos/{id}/reagendar/empresa)
import { useProDashboard } from "../../context/ProDashboardContext";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";
import { RescheduleScreen } from "../../shared/components/RescheduleScreen";
import { useBusinessAppointments } from "../hooks/useBusinessData";

export default function ProRescheduleScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { goToProDate } = useProDashboard();
  const { setScreen } = useSession();
  const appointments = useBusinessAppointments();
  const toAgenda = () => setScreen("proAgendaDash");
  return (
    <RescheduleScreen
      appointments={appointments}
      appointmentId={selectedAppointmentId}
      reschedule={api.appointments.rescheduleAsBusiness}
      summary={(a) => `${a.service} de ${a.clientName}`}
      doneLabel="Ver agenda"
      onBack={toAgenda}
      onNotFound={toAgenda}
      onSaved={goToProDate}
    />
  );
}
