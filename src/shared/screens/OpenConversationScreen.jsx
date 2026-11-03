// Sem visual: recebe /conversa?agendamento=id (toque na notificação), seleciona o agendamento e vai para a conversa da conta · dados: URL e sessão · API: nenhuma
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { pathFor } from "../../routes";
import { appointmentIdFrom, conversationLink, conversationScreenFor } from "../notifications/conversationLink";

export default function OpenConversationScreen() {
  const { auth } = useSession();
  const { setSelectedAppointmentId } = useScheduling();
  const { search } = useLocation();
  const navigate = useNavigate();

  // replace: o botão voltar não pode cair aqui e abrir a conversa de novo
  useEffect(() => {
    const appointmentId = appointmentIdFrom(search);
    const screen = conversationScreenFor(auth?.tipo);
    if (!appointmentId) {
      navigate(pathFor("splash"), { replace: true });
    } else if (!screen) {
      navigate(pathFor("login"), { replace: true, state: { returnTo: conversationLink(appointmentId) } });
    } else {
      setSelectedAppointmentId(appointmentId);
      navigate(pathFor(screen), { replace: true });
    }
  }, [auth?.tipo, navigate, search, setSelectedAppointmentId]);

  return null;
}
