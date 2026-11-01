// Gateway mock do Provador virtual: consentimento em memória e prévia simulada · mock · futuro: API da Kira
import { ApiError } from "./contract";
import { TRYON_CONSENT_VERSION, TRYON_ERRORS } from "./tryOnContract";

const defaultTiming = { consent: 350, generate: 2600 };

/**
 * @param {{ consent: number, generate: number }} [timing]
 * @param {{ failFirst?: boolean }} [options] a primeira geração falha, para exercitar o estado de erro (como a disponibilidade)
 * @returns {import("./tryOnContract").TryOnGateway}
 */
export function createMockTryOn(timing = defaultTiming, { failFirst = true } = {}) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let consent = { accepted: false };
  let generations = 0;
  let storedPhotos = 0;

  return {
    getConsent: async () => {
      await wait(timing.consent);
      return consent;
    },
    acceptConsent: async (version = TRYON_CONSENT_VERSION) => {
      await wait(timing.consent);
      consent = { accepted: true, version, acceptedAt: new Date().toISOString() };
      return consent;
    },
    revokeConsent: async () => {
      await wait(timing.consent);
      consent = { accepted: false };
      storedPhotos = 0;
      return consent;
    },
    generate: async ({ referenceUri, photoUri }) => {
      await wait(timing.generate);
      if (!consent.accepted) throw new ApiError(TRYON_ERRORS.CONSENT_REQUIRED);
      generations += 1;
      if (failFirst && generations === 1) throw new ApiError(TRYON_ERRORS.GENERATION_FAILED);
      storedPhotos += 2;
      // o mock devolve a própria foto; a API real devolve a imagem gerada
      return { resultUri: photoUri ?? referenceUri, generatedAt: new Date().toISOString() };
    },
    deletePhotos: async () => {
      await wait(timing.consent);
      storedPhotos = 0;
      return { ok: true };
    },
    // só para testes
    _storedPhotos: () => storedPhotos,
  };
}

export const mockTryOn = createMockTryOn();
