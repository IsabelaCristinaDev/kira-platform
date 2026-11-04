// Acompanhar agendamento: status em tempo real, linha do tempo e Pix, no estilo de acompanhar um pedido · mock (api.bookings)
import { MessageCircle } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { BOOKING_STEPS, PAYMENT_STATES } from "../../shared/api/bookingContract";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, SecondaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { headline, progressOf } from "../booking/bookingContent";
import { BookingTimeline } from "../components/booking/BookingTimeline";
import { PaymentPanel } from "../components/booking/PaymentPanel";
import { appointmentsMock } from "../data/mocks";
import { useBookingTracking } from "../hooks/useBookingTracking";

export default function ClientBookingTrackingScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen, openWithBack } = useSession();
  const appointment = appointmentsMock.find((a) => a.id === selectedAppointmentId) || appointmentsMock[0];
  const pro = mockProfessionals.find((p) => p.id === appointment.proId) || mockProfessionals[0];
  const { status, booking, reload, reportPayment, paying, payError } = useBookingTracking(appointment.id);
  const awaitingPayment =
    booking && booking.step === BOOKING_STEPS.CONFIRMED && booking.payment.state !== PAYMENT_STATES.CONFIRMED;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientAgendaDetail")} />
      <div
        style={{
          flex: 1,
          padding: "0 var(--space-24) var(--space-32)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-18)",
        }}
      >
        {status === "loading" && <SkeletonLoading count={3} />}
        {status === "error" && (
          <ErrorState message="Não foi possível carregar o acompanhamento agora." onRetry={reload} />
        )}
        {status === "ready" && (
          <>
            <div role="status" aria-live="polite">
              <p
                style={{
                  margin: 0,
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                }}
              >
                {appointment.service} com {pro.name} · {appointment.date}, {appointment.time}
              </p>
              <h1
                style={{
                  margin: "var(--space-4) 0 var(--space-12)",
                  fontFamily: fontDisplay,
                  fontSize: "var(--font-size-2xl)",
                  color: colors.foreground,
                }}
              >
                {headline(booking)}
              </h1>
              <div
                role="progressbar"
                aria-label="Progresso do agendamento"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressOf(booking.step) * 100)}
                style={{ height: 6, borderRadius: "var(--radius-pill)", background: colors.muted, overflow: "hidden" }}
              >
                <div
                  style={{
                    width: `${progressOf(booking.step) * 100}%`,
                    height: "100%",
                    background: gradientKira,
                    transition: "width 400ms ease",
                  }}
                />
              </div>
            </div>
            {awaitingPayment && (
              <PaymentPanel payment={booking.payment} paying={paying} error={payError} onReport={reportPayment} />
            )}
            <BookingTimeline booking={booking} />
            <SecondaryButton onClick={() => openWithBack("clientChat", "clientBookingTracking")}>
              <MessageCircle size={15} aria-hidden="true" /> Falar com o atendimento
            </SecondaryButton>
          </>
        )}
      </div>
    </div>
  );
}
