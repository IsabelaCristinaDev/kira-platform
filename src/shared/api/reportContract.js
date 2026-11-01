// Contrato do canal de segurança: denúncia anônima, risco imediato e protocolo · futuro: POST /api/denuncias

/** Motivos de denúncia (mesmos valores do canal de segurança do web). */
export const REPORT_REASONS = [
  { value: "endereco_invalido", label: "Endereço não confere" },
  { value: "comportamento_suspeito", label: "Comportamento suspeito" },
  { value: "risco_imediato", label: "Risco imediato" },
  { value: "outro", label: "Outro" },
];

export const IMMEDIATE_REASON = "risco_imediato";

export const REPORT_ROLES = { CLIENT: "CLIENTE", PROFESSIONAL: "PROFISSIONAL" };

export const REPORT_ERRORS = { SEND_FAILED: "report_send_failed", INVALID: "report_invalid" };

/**
 * @typedef {Object} ReportInput
 * @property {string} reason um valor de REPORT_REASONS
 * @property {string} [description]
 * @property {string} [role] REPORT_ROLES
 * @property {number} [appointmentId]
 * @property {number} [professionalId] perfil denunciado
 */

/**
 * @typedef {Object} ReportReceipt
 * @property {string} protocol código para acompanhar a denúncia
 * @property {boolean} immediate risco imediato: a equipe é avisada na hora, sem fila
 * @property {boolean} anonymous false no risco imediato, para a equipe poder entrar em contato
 * @property {boolean} preventiveSuspension perfil envolvido suspenso de forma preventiva
 * @property {string} createdAt ISO
 */

/**
 * @typedef {Object} ReportGateway
 * @property {(input: ReportInput) => Promise<ReportReceipt>} submit
 *   futuro: POST /api/denuncias. A identidade nunca vai no corpo: o backend associa pelo token de sessão e guarda só
 *   o hash, mantendo a denúncia anônima perante o profissional e a equipe (exceto no risco imediato).
 */
