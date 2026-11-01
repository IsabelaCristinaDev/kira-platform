// Testes do gateway mock do acompanhamento (etapas, aviso de pagamento e falha na primeira leitura) · API: nenhuma
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BOOKING_ERRORS, BOOKING_STEPS, PAYMENT_STATES } from "./bookingContract";
import { createMockBookings } from "./mockBookings";

const timing = { latency: 0, step: 1000, review: 500 };

// com timers falsos, as esperas do mock só andam quando o relógio avança
const settle = async (promise) => {
  const result = promise.then(
    (value) => ({ value }),
    (error) => ({ error }),
  );
  await vi.advanceTimersByTimeAsync(0);
  const { value, error } = await result;
  if (error) throw error;
  return value;
};

describe("createMockBookings", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("falha na primeira leitura e funciona na segunda", async () => {
    const bookings = createMockBookings(timing);
    await expect(settle(bookings.get("ag1"))).rejects.toMatchObject({ code: BOOKING_ERRORS.UNAVAILABLE });
    await expect(settle(bookings.get("ag1"))).resolves.toMatchObject({ step: BOOKING_STEPS.RECEIVED });
  });

  it("começa em recebido, com Pix pendente", async () => {
    const bookings = createMockBookings(timing, { failFirst: false });
    const booking = await settle(bookings.get("ag1"));
    expect(booking.step).toBe(BOOKING_STEPS.RECEIVED);
    expect(booking.payment.state).toBe(PAYMENT_STATES.PENDING);
    expect(booking.history).toHaveLength(1);
  });

  it("a profissional confirma sozinha e o pagamento fica esperando", async () => {
    const bookings = createMockBookings(timing, { failFirst: false });
    const seen = [];
    bookings.subscribe("ag1", (b) => seen.push(b.step));
    await vi.advanceTimersByTimeAsync(5000);
    expect(seen).toEqual([BOOKING_STEPS.CONFIRMED]);
  });

  it("depois do aviso o pagamento é conferido e as etapas seguem até concluir", async () => {
    const bookings = createMockBookings(timing, { failFirst: false });
    const seen = [];
    bookings.subscribe("ag1", (b) => seen.push([b.step, b.payment.state]));
    await vi.advanceTimersByTimeAsync(1000);
    await settle(bookings.reportPayment("ag1"));
    await vi.advanceTimersByTimeAsync(500);
    await vi.advanceTimersByTimeAsync(3000);
    expect(seen.map(([step]) => step)).toEqual([
      BOOKING_STEPS.CONFIRMED,
      BOOKING_STEPS.CONFIRMED,
      BOOKING_STEPS.PAYMENT,
      BOOKING_STEPS.READY,
      BOOKING_STEPS.IN_SERVICE,
      BOOKING_STEPS.DONE,
    ]);
    expect(seen[1][1]).toBe(PAYMENT_STATES.REVIEW);
    expect(seen.at(-1)[1]).toBe(PAYMENT_STATES.CONFIRMED);
  });

  it("avisar o pagamento duas vezes não reinicia a conferência", async () => {
    const bookings = createMockBookings(timing, { failFirst: false });
    bookings.subscribe("ag1", () => {});
    await settle(bookings.reportPayment("ag1"));
    const again = await settle(bookings.reportPayment("ag1"));
    expect(again.payment.state).toBe(PAYMENT_STATES.REVIEW);
  });

  it("avisar pagamento de agendamento desconhecido dá erro", async () => {
    const bookings = createMockBookings(timing);
    await expect(settle(bookings.reportPayment("x"))).rejects.toMatchObject({ code: BOOKING_ERRORS.NOT_FOUND });
  });
});
