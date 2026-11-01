// Contrato do Provador virtual: consentimento LGPD, geração da prévia e exclusão das fotos · futuro: API da Kira + Cloudflare Workers AI

/** Versão do texto de consentimento; muda quando o texto jurídico muda. */
export const TRYON_CONSENT_VERSION = "v1";

export const TRYON_ERRORS = {
  CONSENT_REQUIRED: "tryon_consent_required",
  GENERATION_FAILED: "tryon_generation_failed",
};

/**
 * @typedef {Object} TryOnConsent
 * @property {boolean} accepted
 * @property {string} [version]
 * @property {string} [acceptedAt] ISO
 */

/**
 * @typedef {Object} TryOnResult
 * @property {string} resultUri imagem da prévia
 * @property {string} generatedAt ISO
 */

/**
 * @typedef {Object} TryOnGateway
 * @property {() => Promise<TryOnConsent>} getConsent
 *   futuro: GET /provador/consentimento
 * @property {(version: string) => Promise<TryOnConsent>} acceptConsent
 *   futuro: POST /provador/consentimento (guarda versão, data e usuário)
 * @property {() => Promise<TryOnConsent>} revokeConsent
 *   futuro: DELETE /provador/consentimento (revoga e apaga as fotos do cliente)
 * @property {(p: { referenceUri: string, photoUri: string }) => Promise<TryOnResult>} generate
 *   futuro: envio das fotos por URL assinada (S3) e POST /provador/geracoes; exige consentimento ativo
 * @property {() => Promise<{ ok: true }>} deletePhotos
 *   futuro: DELETE /provador/fotos
 */
