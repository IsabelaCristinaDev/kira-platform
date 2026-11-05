// Sem visual: liga o service worker ao app (conversa aberta, abrir conversa) e mantém o navegador registrado na conta logada · dados: sessão e agendamento selecionado · API: kira-backend (api.notifications)
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../shared/api";
import {
  ASK_CONVERSATION_OPEN,
  conversationLink,
  isConversationOnScreen,
  OPEN_CONVERSATION,
} from "../shared/notifications/conversationLink";
import { useScheduling } from "./SchedulingContext";
import { useSession } from "./SessionContext";

export function WebPushBridge() {
  const { auth, screen } = useSession();
  const { selectedAppointmentId } = useScheduling();
  const navigate = useNavigate();
  const userId = auth?.id ?? null;

  useEffect(() => {
    if (userId) api.notifications.sync();
  }, [userId]);

  useEffect(() => {
    const worker = globalThis.navigator?.serviceWorker;
    if (!worker) return undefined;
    const onMessage = ({ data, ports }) => {
      if (data?.type === ASK_CONVERSATION_OPEN) {
        const current = { screen, selectedAppointmentId, visibilityState: document.visibilityState };
        ports[0]?.postMessage(isConversationOnScreen(current, data.agendamentoId));
      } else if (data?.type === OPEN_CONVERSATION) {
        navigate(conversationLink(data.agendamentoId));
      }
    };
    worker.addEventListener("message", onMessage);
    return () => worker.removeEventListener("message", onMessage);
  }, [navigate, screen, selectedAppointmentId]);

  return null;
}
