// Seleção visual de nota de 1 a 5 estrelas (grupo de opções acessível por teclado) · API: nenhuma
import { Star } from "lucide-react";
import { colors } from "../theme";

export const StarRatingInput = ({ value, onChange, label = "Nota" }) => (
  <div
    role="radiogroup"
    aria-label={label}
    style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center" }}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
        className="k-chip"
        onClick={() => onChange(n)}
        style={{
          width: 44,
          height: 44,
          border: "none",
          background: "transparent",
          borderRadius: "var(--radius-round)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Star
          size={30}
          color={n <= value ? colors.accent : colors.border}
          fill={n <= value ? colors.accent : "none"}
          aria-hidden="true"
        />
      </button>
    ))}
  </div>
);
