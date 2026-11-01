// Textos do acompanhamento do agendamento: etapas, título do momento e estado do Pix · API: nenhuma
import { BOOKING_STEPS, BOOKING_STEP_ORDER, PAYMENT_STATES } from "../../shared/api/bookingContract";

export const stepContent = {
  [BOOKING_STEPS.RECEIVED]: { title: "Pedido enviado", text: "Enviamos o seu agendamento para a profissional." },
  [BOOKING_STEPS.CONFIRMED]: { title: "Profissional confirmou", text: "O seu horário está reservado." },
  [BOOKING_STEPS.PAYMENT]: { title: "Pagamento confirmado", text: "Recebemos o seu Pix." },
  [BOOKING_STEPS.READY]: { title: "Quase na hora", text: "A profissional está se preparando para te receber." },
  [BOOKING_STEPS.IN_SERVICE]: { title: "Em atendimento", text: "Aproveite o seu momento." },
  [BOOKING_STEPS.DONE]: { title: "Atendimento concluído", text: "Conte para a gente como foi." },
};

// o que mostrar no topo, como o status grande do iFood
export function headline(booking) {
  const { step, payment } = booking;
  if (step === BOOKING_STEPS.RECEIVED) return "Aguardando a profissional confirmar";
  if (step === BOOKING_STEPS.CONFIRMED) {
    return payment.state === PAYMENT_STATES.REVIEW ? "Conferindo o seu pagamento" : "Falta só o pagamento";
  }
  return stepContent[step].title;
}

// 0 a 1, para a barra de progresso
export const progressOf = (step) => (BOOKING_STEP_ORDER.indexOf(step) + 1) / BOOKING_STEP_ORDER.length;

export const formatStepTime = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
