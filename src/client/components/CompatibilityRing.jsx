// Indicador circular de compatibilidade (0 a 100) · API: nenhuma
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export const CompatibilityRing = ({ value, size = 96 }) => {
  const available = Number.isFinite(value);
  const r = 40;
  const c = 2 * Math.PI * r;
  return (
    <div
      role="img"
      aria-label={available ? `Compatibilidade: ${value}%` : "Compatibilidade indisponível"}
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="k-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary-hsl))" />
            <stop offset="100%" stopColor="var(--color-violet)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--primary-hsl) / 0.15)" strokeWidth="9" />
        {available && (
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="url(#k-ring)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${(c * value) / 100} ${c}`}
            transform="rotate(-90 50 50)"
          />
        )}
      </svg>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: available ? fontDisplay : fontBody,
          fontWeight: 700,
          fontSize: available ? "var(--font-size-xl)" : "var(--font-size-xs)",
          color: colors.foreground,
          textAlign: "center",
        }}
      >
        {available ? `${value}%` : "—"}
      </span>
    </div>
  );
};
