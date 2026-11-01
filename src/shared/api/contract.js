// Contrato da API (JSDoc): formato dos dados que as telas recebem do adaptador HTTP · API: kira-backend

/**
 * Empresa/estúdio do backend (`/api/studios`) no formato das telas.
 * @typedef {Object} Professional
 * @property {string} id
 * @property {string} name
 * @property {string} role                 "Estúdio" ou "Profissional autônoma"
 * @property {string} description
 * @property {string|null} photo
 * @property {string} phone
 * @property {string} address              endereço em uma linha ("" quando não cadastrado)
 * @property {string} city
 * @property {number|null} rating         média das avaliações (null sem avaliações)
 * @property {number|null} reviews        quantidade de avaliações (só no detalhe)
 * @property {number|null} price          menor preço entre os serviços ativos
 * @property {number|null} distance       km; o backend ainda não devolve coordenadas
 * @property {Service[]} services
 */

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} durationMinutes
 * @property {number} price
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {"proximo"|"concluido"|"cancelado"} status   aba da agenda
 * @property {"PENDENTE"|"CONFIRMADO"|"CANCELADO"|"CONCLUIDO"|"REAGENDADO"} rawStatus
 * @property {string} proId
 * @property {string} proName
 * @property {string|null} staffId
 * @property {string|null} staffName
 * @property {string} clientId
 * @property {string} clientName
 * @property {string} serviceId
 * @property {string} service
 * @property {Date} start
 * @property {string} date                 "Hoje", "Amanhã" ou "dd/mm"
 * @property {string} time                 "HH:mm"
 * @property {string} payment              rótulo da forma de pagamento ("" se não informada)
 */

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} appointmentId
 * @property {string} proId
 * @property {string} proName
 * @property {string} clientName
 * @property {"CLIENTE"|"EMPRESA"} author
 * @property {number} rating
 * @property {string} text
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Address
 * @property {string} street
 * @property {string} neighborhood
 * @property {string} city
 * @property {string} state
 */

/**
 * Funcionária do estúdio logado.
 * @typedef {Object} Staff
 * @property {string} id
 * @property {string} name
 * @property {string|null} photo
 * @property {string} specialties          texto livre
 * @property {boolean} active
 * @property {number|null} commissionPercent
 */

/**
 * Bloqueio de horário de uma funcionária (folga, almoço…).
 * @typedef {Object} TimeBlock
 * @property {string} id
 * @property {string} staffId
 * @property {string} staffName
 * @property {Date} start
 * @property {Date} end
 * @property {string} reason
 */

/**
 * Mensagem do chat de um agendamento.
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} appointmentId
 * @property {string} senderId
 * @property {string} senderName
 * @property {string} text
 * @property {boolean} read
 * @property {Date} sentAt
 * @property {boolean} mine                enviada pelo usuário logado
 */

/**
 * Painel do estúdio (`/dashboard`): só atendimentos concluídos no período.
 * @typedef {Object} Dashboard
 * @property {number} revenue
 * @property {number} appointments
 * @property {number} uniqueClients
 * @property {number} returningClients
 * @property {number} returningPercent
 * @property {{staffId: string|null, name: string|null, revenue: number, appointments: number}[]} byStaff
 * @property {{clientId: string, name: string, appointments: number, revenue: number}[]} topClients
 * @property {{hour: number, appointments: number}[]} byHour
 * @property {{day: string, appointments: number}[]} byWeekday   chaves de `weekDays` ("SEGUNDA"…)
 */

export class ApiError extends Error {
  constructor(code, message, status = 0, details = null) {
    super(message ?? code);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Mensagem para mostrar na tela a partir de qualquer erro de requisição
export const errorMessage = (error, fallback = "Algo deu errado. Tente novamente.") => {
  if (!(error instanceof ApiError)) return fallback;
  const fields = error.details?.erros ? Object.values(error.details.erros) : [];
  if (fields.length > 0) return fields.join(" ");
  if (error.status === 401 || error.code === "CREDENCIAIS_INVALIDAS") return "E-mail ou senha incorretos.";
  if (error.status === 0 || error.status >= 500) return error.message || fallback;
  return error.message || fallback;
};
