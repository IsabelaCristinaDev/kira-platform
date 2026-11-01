// Gateway mock do acompanhamento: etapas que avançam sozinhas e Pix conferido depois do aviso · mock · futuro: API da Kira
import { ApiError } from "./contract";
import { BOOKING_ERRORS, BOOKING_STEPS, PAYMENT_STATES } from "./bookingContract";

const defaultTiming = { latency: 400, step: 6000, review: 5000 };

// etapas que avançam sozinhas depois que o pagamento é confirmado
const AFTER_PAYMENT = [BOOKING_STEPS.READY, BOOKING_STEPS.IN_SERVICE, BOOKING_STEPS.DONE];

/**
 * @param {{ latency: number, step: number, review: number }} [timing]
 * @param {{ failFirst?: boolean, amount?: number }} [options] a primeira leitura falha, para exercitar o estado de erro
 * @returns {import("./bookingContract").BookingGateway}
 */
export function createMockBookings(timing = defaultTiming, { failFirst = true, amount = 80 } = {}) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const store = new Map();
  let reads = 0;

  const emit = (entry) => {
    entry.booking = { ...entry.booking, updatedAt: new Date().toISOString() };
    entry.listeners.forEach((listener) => listener(entry.booking));
  };

  const reach = (entry, step) => {
    const at = new Date().toISOString();
    entry.booking = { ...entry.booking, step, history: [...entry.booking.history, { step, at }] };
    emit(entry);
  };

  const advanceAfterPayment = (entry, index = 0) => {
    if (index >= AFTER_PAYMENT.length) return;
    setTimeout(() => {
      reach(entry, AFTER_PAYMENT[index]);
      advanceAfterPayment(entry, index + 1);
    }, timing.step);
  };

  const open = (id) => {
    if (store.has(id)) return store.get(id);
    const now = new Date().toISOString();
    const entry = {
      listeners: new Set(),
      booking: {
        id,
        step: BOOKING_STEPS.RECEIVED,
        payment: {
          method: "pix",
          state: PAYMENT_STATES.PENDING,
          amount,
          // código de exemplo: o real vem do provedor de pagamento
          pixCode: `KIRA-PIX-EXEMPLO-${id}`,
        },
        history: [{ step: BOOKING_STEPS.RECEIVED, at: now }],
        updatedAt: now,
      },
    };
    store.set(id, entry);
    setTimeout(() => reach(entry, BOOKING_STEPS.CONFIRMED), timing.step);
    return entry;
  };

  return {
    get: async (id) => {
      await wait(timing.latency);
      reads += 1;
      if (failFirst && reads === 1) throw new ApiError(BOOKING_ERRORS.UNAVAILABLE);
      return open(id).booking;
    },
    subscribe: (id, onChange) => {
      const entry = open(id);
      entry.listeners.add(onChange);
      return () => entry.listeners.delete(onChange);
    },
    reportPayment: async (id) => {
      await wait(timing.latency);
      const entry = store.get(id);
      if (!entry) throw new ApiError(BOOKING_ERRORS.NOT_FOUND);
      if (entry.booking.payment.state !== PAYMENT_STATES.PENDING) return entry.booking;
      entry.booking = { ...entry.booking, payment: { ...entry.booking.payment, state: PAYMENT_STATES.REVIEW } };
      emit(entry);
      setTimeout(() => {
        entry.booking = { ...entry.booking, payment: { ...entry.booking.payment, state: PAYMENT_STATES.CONFIRMED } };
        reach(entry, BOOKING_STEPS.PAYMENT);
        advanceAfterPayment(entry);
      }, timing.review);
      return entry.booking;
    },
  };
}

export const mockBookings = createMockBookings();
