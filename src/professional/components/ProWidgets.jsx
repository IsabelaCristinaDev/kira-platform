// Card de métrica e gráfico de faturamento interativo · API: nenhuma
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

// NOVO — Cartão pequeno de estatística usado no painel do profissional
// (clientes hoje, receita, nota, saldo disponível etc.).
export const ProStatCard = ({ label, value, icon: Icon }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
      padding: "var(--space-14)",
      borderRadius: "var(--radius-2xl)",
      border: `1px solid ${colors.border}`,
      background: colors.card,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
        {label}
      </span>
      {Icon && <Icon size={13} color={colors.primary} />}
    </div>
    <span
      style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: "var(--font-size-lg)", color: colors.foreground }}
    >
      {value}
    </span>
  </div>
);

// NOVO — Gráfico de barras simples (sem libs externas, só CSS) para o
// faturamento do profissional, igual ao mockup do folheto. Funcional: cada
// barra é clicável e destaca o dia/semana selecionado (selectedIndex/onSelect
// são opcionais — sem eles o gráfico continua só ilustrativo, como antes).
export const RevenueBarChart = ({ data, selectedIndex, onSelect }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  const peakIndex = data.reduce((best, d, i, arr) => (d.value > arr[best].value ? i : best), 0);
  const hasPeak = data.some((d) => d.value > 0);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-8)", height: 90 }}>
      {data.map((d, i) => {
        const isSelected = selectedIndex === i;
        const isPeak = hasPeak && i === peakIndex;
        return (
          <button
            key={d.label}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(i);
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-6)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: onSelect ? "pointer" : "default",
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: "var(--radius-sm)",
                height: `${Math.max(10, (d.value / max) * 74)}px`,
                background: isPeak || isSelected ? gradientKira : colors.muted,
                boxShadow: isSelected ? `0 0 0 2px ${colors.primary}` : "none",
              }}
            />
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? colors.primaryText : colors.mutedForeground,
              }}
            >
              {d.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
