// Contrato do chat de atendimento (tipos em JSDoc e constantes): o que o front espera de qualquer gateway, mock ou n8n · API: nenhuma

export const MESSAGE_TYPES = {
  TEXT: "text",
  QUICK_REPLIES: "quick_replies",
  PROFESSIONAL: "professional",
  SCHEDULING: "scheduling",
  SYSTEM: "system",
};

export const AUTHORS = { USER: "user", AI: "ai", HUMAN: "human", SYSTEM: "system" };

export const CHAT_AGENTS = { AI: "ai", HUMAN: "human" };

export const HANDOFF_STATES = { NONE: "none", WAITING: "waiting", CONNECTED: "connected" };

export const CHAT_STATUS = { LOADING: "loading", READY: "ready", ERROR: "error" };

export const DELIVERY = { SENDING: "sending", SENT: "sent", FAILED: "failed", QUEUED: "queued" };

/** @typedef {"text"|"quick_replies"|"professional"|"scheduling"|"system"} MessageType */
/** @typedef {"user"|"ai"|"human"|"system"} MessageAuthor */
/** @typedef {"ai"|"human"} ChatAgent */
/** @typedef {"none"|"waiting"|"connected"} HandoffState */
/** @typedef {"loading"|"ready"|"error"} ChatStatus */
/** @typedef {"sending"|"sent"|"failed"|"queued"} DeliveryState */

/**
 * Horário sugerido pela assistente, mostrado no cartão de agendamento.
 * @typedef {Object} ScheduleSuggestion
 * @property {string} professionalName
 * @property {string} service
 * @property {string} dateLabel
 * @property {string} time
 * @property {number} price
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {MessageType} type
 * @property {MessageAuthor} author
 * @property {string} createdAt data e hora em ISO 8601
 * @property {string} [authorName] nome mostrado acima da mensagem do atendente
 * @property {string} [text] texto da mensagem (tipos text e system)
 * @property {string[]} [options] respostas rápidas (tipo quick_replies)
 * @property {object} [professional] dados do profissional sugerido (tipo professional)
 * @property {ScheduleSuggestion} [suggestion] horário sugerido (tipo scheduling)
 * @property {DeliveryState} [delivery] entrega, só em mensagens do usuário
 */

/**
 * @typedef {Object} ChatConversation
 * @property {ChatMessage[]} messages
 * @property {ChatAgent} agent
 * @property {HandoffState} handoff
 */

/**
 * Eventos que chegam do servidor (hoje simulados; futuro: SSE ou WebSocket).
 * @typedef {{ type: "message", message: ChatMessage }
 *   | { type: "typing", on: boolean }
 *   | { type: "agent", agent: ChatAgent }
 *   | { type: "handoff", state: HandoffState }} ChatEvent
 */

/**
 * Interface que todo gateway de chat cumpre. Trocar o mock pelo n8n é trocar o adaptador em `api/index.js`.
 * @typedef {Object} ChatGateway
 * @property {() => Promise<ChatConversation>} load
 *   futuro: GET /atendimento/conversa
 * @property {(text: string) => Promise<ChatMessage>} send
 *   futuro: POST /atendimento/mensagens (webhook do n8n); a resposta chega por `subscribe`
 * @property {() => Promise<void>} requestHandoff
 *   futuro: POST /atendimento/transferencia
 * @property {() => Promise<void>} cancelHandoff
 *   futuro: DELETE /atendimento/transferencia
 * @property {(onEvent: (event: ChatEvent) => void) => () => void} subscribe
 *   futuro: SSE ou WebSocket em /atendimento/eventos; devolve a função que cancela a inscrição
 */
