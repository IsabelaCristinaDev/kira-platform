// Gateway mock da denúncia: valida, devolve protocolo e simula a regra de risco imediato · mock · futuro: API da Kira
import { ApiError } from "./contract";
import { IMMEDIATE_REASON, REPORT_ERRORS, REPORT_REASONS } from "./reportContract";

const defaultTiming = { submit: 900 };

/**
 * @param {{ submit: number }} [timing]
 * @param {{ failFirst?: boolean }} [options] o primeiro envio falha, para exercitar o estado de erro
 * @returns {import("./reportContract").ReportGateway}
 */
export function createMockReports(timing = defaultTiming, { failFirst = true } = {}) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let sent = 0;
  let attempts = 0;

  return {
    submit: async ({ reason, description = "" } = {}) => {
      await wait(timing.submit);
      if (!REPORT_REASONS.some((r) => r.value === reason)) throw new ApiError(REPORT_ERRORS.INVALID);
      attempts += 1;
      if (failFirst && attempts === 1) throw new ApiError(REPORT_ERRORS.SEND_FAILED);
      sent += 1;
      const immediate = reason === IMMEDIATE_REASON;
      return {
        protocol: `KR-${String(sent).padStart(4, "0")}`,
        immediate,
        anonymous: !immediate,
        preventiveSuspension: immediate,
        createdAt: new Date().toISOString(),
        // o mock não guarda o texto; só confirma que o campo opcional chegou
        hasDescription: description.trim().length > 0,
      };
    },
  };
}

export const mockReports = createMockReports();
