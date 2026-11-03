// Ligação entre a notificação e a conversa: endereço, tela de cada conta e conversa aberta · dados: sessão e agendamento selecionado · API: nenhuma
// As mensagens e o endereço são repetidos em public/sw.js, que não passa pelo bundler (o teste confere).
export const ASK_CONVERSATION_OPEN = "kira:conversa-aberta";
export const OPEN_CONVERSATION = "kira:abrir-conversa";
export const OPEN_CONVERSATION_PATH = "/conversa";
const APPOINTMENT_PARAM = "agendamento";

const CONVERSATION_SCREENS = { CLIENTE: "clientConversation", EMPRESA: "proConversation" };

export const conversationLink = (appointmentId) =>
  `${OPEN_CONVERSATION_PATH}?${APPOINTMENT_PARAM}=${encodeURIComponent(appointmentId)}`;

export const appointmentIdFrom = (search) => new URLSearchParams(search).get(APPOINTMENT_PARAM) || null;

// Tela de conversa da conta logada; null sem sessão
export const conversationScreenFor = (tipo) => CONVERSATION_SCREENS[tipo] ?? null;

export const isConversationOnScreen = ({ screen, selectedAppointmentId, visibilityState }, appointmentId) =>
  visibilityState === "visible" &&
  Object.values(CONVERSATION_SCREENS).includes(screen) &&
  selectedAppointmentId != null &&
  String(selectedAppointmentId) === String(appointmentId);
