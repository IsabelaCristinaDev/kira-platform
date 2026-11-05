// Calendário mensal e grade de horários do agendamento · API: nenhuma
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { colors, fontBody, fontDisplay, gradientKira } from "../theme";

// "novembro de 2026" vira "Novembro de 2026": só a inicial maiúscula (o capitalize do CSS deixava "De")
const formatMonth = (date) => {
  const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const CalendarHeader = ({ monthDate, onPrev, onNext, canGoPrev }) => (
  <div
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-14)" }}
  >
    <button
      className="k-hit"
      onClick={onPrev}
      disabled={!canGoPrev}
      aria-label="Mês anterior"
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--radius-round)",
        border: "none",
        background: colors.muted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: canGoPrev ? "pointer" : "not-allowed",
        opacity: canGoPrev ? 1 : 0.4,
      }}
    >
      <ChevronLeft size={17} color={colors.foreground} />
    </button>
    <span
      style={{
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: "var(--font-size-base)",
        color: colors.foreground,
      }}
    >
      {formatMonth(monthDate)}
    </span>
    <button
      className="k-hit"
      onClick={onNext}
      aria-label="Próximo mês"
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--radius-round)",
        border: "none",
        background: colors.muted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <ChevronRight size={17} color={colors.foreground} />
    </button>
  </div>
);

export const CalendarDay = ({ cell, selected, onClick }) => {
  const disabled = !cell.inMonth || cell.unavailable;
  return (
    <button
      onClick={() => !disabled && onClick(cell.date)}
      disabled={disabled}
      style={{
        aspectRatio: "1/1",
        borderRadius: "var(--radius-lg)",
        border: cell.isToday && !selected ? `1.5px solid ${colors.primary}` : "1.5px solid transparent",
        background: selected ? gradientKira : "transparent",
        color: !cell.inMonth
          ? colors.border
          : cell.unavailable
            ? colors.mutedForeground
            : selected
              ? colors.primaryForeground
              : colors.foreground,
        opacity: !cell.inMonth ? 0.35 : cell.unavailable ? 0.5 : 1,
        textDecoration: cell.unavailable && cell.inMonth ? "line-through" : "none",
        fontFamily: fontBody,
        fontSize: "var(--font-size-sm)",
        fontWeight: selected ? 700 : 500,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease",
        transform: selected ? "scale(1.05)" : "scale(1)",
      }}
    >
      {cell.date.getDate()}
    </button>
  );
};

// `isDayAvailable` diz quais dias podem ser escolhidos; sem ele, todos a partir de hoje
export const CalendarMonth = ({ monthDate, selectedDate, today, monthKey, onSelect, isDayAvailable }) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month, 1 - (startOffset - i));
    cells.push({ date: d, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return (
    <div key={monthKey} style={{ animation: "kiraCalendarFade 0.25s ease" }}>
      <style>
        {
          "@keyframes kiraCalendarFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }"
        }
      </style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: "var(--space-6)" }}>
        {weekDays.map((w) => (
          <span
            key={w}
            style={{
              textAlign: "center",
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: 700,
              color: colors.mutedForeground,
            }}
          >
            {w}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "var(--space-4)" }}>
        {cells.map((cell, i) => {
          const midnight = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate());
          const available = isDayAvailable ? isDayAvailable(midnight) : midnight >= today;
          const unavailable = cell.inMonth && !available;
          const isToday = midnight.getTime() === today.getTime();
          const isSelected = !!selectedDate && midnight.getTime() === selectedDate.getTime();
          return (
            <CalendarDay key={i} cell={{ ...cell, unavailable, isToday }} selected={isSelected} onClick={onSelect} />
          );
        })}
      </div>
    </div>
  );
};

export const TimeSlotButton = ({ time, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-4)",
      padding: "var(--space-10) var(--space-6)",
      borderRadius: "var(--radius-lg)",
      border: `1px solid ${selected ? colors.primary : colors.border}`,
      background: selected ? gradientKira : colors.card,
      color: selected ? colors.primaryForeground : colors.foreground,
      fontFamily: fontBody,
      fontSize: "var(--font-size-xs)",
      fontWeight: selected ? 700 : 500,
      cursor: "pointer",
      transition: "background 0.2s ease, transform 0.15s ease",
      transform: selected ? "scale(1.04)" : "scale(1)",
    }}
  >
    <Clock size={12} color={selected ? colors.primaryForeground : colors.mutedForeground} /> {time}
  </button>
);

export const TimeSlotGrid = ({ times, selectedTime, onSelect }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-8)" }}>
    {times.map((time) => (
      <TimeSlotButton key={time} time={time} selected={selectedTime === time} onClick={() => onSelect(time)} />
    ))}
  </div>
);

export const EmptySchedule = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-8)",
      padding: "var(--space-28) var(--space-16)",
      textAlign: "center",
    }}
  >
    <span style={{ fontSize: "var(--font-size-3xl)" }}>📅</span>
    <p
      style={{
        fontFamily: fontBody,
        fontSize: "var(--font-size-sm)",
        color: colors.foreground,
        fontWeight: 600,
        margin: 0,
      }}
    >
      Nenhum horário disponível nesta data.
    </p>
    <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 }}>
      Escolha outro dia.
    </p>
  </div>
);

export const LoadingSchedule = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-8)" }}>
    <style>{"@keyframes kiraPulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }"}</style>
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 38,
          borderRadius: "var(--radius-lg)",
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
    ))}
  </div>
);
