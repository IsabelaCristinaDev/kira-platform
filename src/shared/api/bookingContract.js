// Contrato do acompanhamento do agendamento (etapas e pagamento Pix) · API: nenhuma · futuro: eventos da API da Kira

/** Etapas na ordem em que acontecem; `pagamento` só é atingida quando o Pix é confirmado. */
export const BOOKING_STEPS = {
  RECEIVED: "recebido",
  CONFIRMED: "confirmado",
  PAYMENT: "pagamento",
  READY: "a_caminho",
  IN_SERVICE: "em_atendimento",
  DONE: "concluido",
};

export const BOOKING_STEP_ORDER = Object.values(BOOKING_STEPS);

export const PAYMENT_STATES = { PENDING: "pendente", REVIEW: "em_analise", CONFIRMED: "confirmado" };

export const BOOKING_ERRORS = { NOT_FOUND: "booking_not_found", UNAVAILABLE: "booking_unavailable" };

/**
 * @typedef {Object} BookingTracking
 * @property {string} id
 * @property {string} step etapa atual (uma de BOOKING_STEPS)
 * @property {{ method: "pix", state: string, amount: number, pixCode: string }} payment
 * @property {Array<{ step: string, at: string }>} history quando cada etapa foi atingida
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} BookingGateway
 * @property {(id: string) => Promise<BookingTracking>} get
 *   futuro: GET /agendamentos/:id/acompanhamento
 * @property {(id: string, onChange: (booking: BookingTracking) => void) => () => void} subscribe
 *   futuro: SSE ou WebSocket do agendamento; devolve a função que cancela
 * @property {(id: string) => Promise<BookingTracking>} reportPayment
 *   futuro: POST /agendamentos/:id/pagamento/aviso (cliente avisa que pagou; a equipe confere e confirma)
 */
