// Jornada completa do cliente: etapas feitas, etapa atual e futuras (reaproveita o ponto da linha do tempo do agendamento) · API: nenhuma
import { colors, fontBody } from "../../shared/theme";
import { Dot } from "./booking/BookingTimeline";

export const JourneyTimeline = ({ steps, current, times = {} }) => (
  <ol style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Etapas da jornada">
    {steps.map((label, index) => {
      const state = index < current ? "done" : index === current ? "current" : "todo";
      const last = index === steps.length - 1;
      return (
        <li
          key={label}
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
              {label}
              <span className="k-sr-only">
                {state === "done" ? " (concluída)" : state === "current" ? " (etapa atual)" : " (futura)"}
              </span>
            </p>
            {times[index] && (
              <p
                style={{
                  margin: 0,
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                }}
              >
                {times[index]} · exemplo
              </p>
            )}
          </div>
        </li>
      );
    })}
  </ol>
);
