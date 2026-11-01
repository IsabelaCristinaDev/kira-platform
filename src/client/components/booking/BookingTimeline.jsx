// Linha do tempo do agendamento: etapas feitas, etapa atual e próximas, com a hora de cada uma · API: nenhuma
import { Check } from "lucide-react";
import { BOOKING_STEPS, BOOKING_STEP_ORDER } from "../../../shared/api/bookingContract";
import { colors, fontBody, gradientKira } from "../../../shared/theme";
import { formatStepTime, stepContent } from "../../booking/bookingContent";

const Dot = ({ state }) => (
  <div
    aria-hidden="true"
    style={{
      width: 24,
      height: 24,
      borderRadius: "var(--radius-round)",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      background: state === "done" ? gradientKira : colors.card,
      border: state === "done" ? "none" : `2px solid ${state === "current" ? colors.primary : colors.border}`,
      animation: state === "current" ? "kiraPulse 1.6s ease-in-out infinite" : undefined,
    }}
  >
    {state === "done" && <Check size={14} color={colors.primaryForeground} />}
  </div>
);

export const BookingTimeline = ({ booking }) => {
  const reached = BOOKING_STEP_ORDER.indexOf(booking.step);
  const timeOf = (step) => booking.history.find((h) => h.step === step)?.at;
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Etapas do agendamento">
      {BOOKING_STEP_ORDER.map((step, index) => {
        const finished = index < reached || (index === reached && step === BOOKING_STEPS.DONE);
        const state = finished ? "done" : index === reached ? "current" : "todo";
        const last = index === BOOKING_STEP_ORDER.length - 1;
        const at = timeOf(step);
        return (
          <li
            key={step}
            aria-current={state === "current" ? "step" : undefined}
            style={{ display: "flex", gap: "var(--space-12)" }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Dot state={state} />
              {!last && (
                <div
                  aria-hidden="true"
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background: state === "done" ? colors.primary : colors.border,
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: last ? 0 : "var(--space-16)", opacity: state === "todo" ? 0.55 : 1 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: state === "todo" ? 500 : 700,
                  color: colors.foreground,
                }}
              >
                {stepContent[step].title}
                {at && <span style={{ fontWeight: 400, color: colors.mutedForeground }}> · {formatStepTime(at)}</span>}
              </p>
              {state !== "todo" && (
                <p
                  style={{
                    margin: 0,
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                  }}
                >
                  {stepContent[step].text}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
