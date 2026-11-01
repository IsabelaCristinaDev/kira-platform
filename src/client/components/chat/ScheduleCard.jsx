// Cartão de agendamento do chat: horário sugerido pela IA com confirmar ou pedir outro · API: nenhuma
import { CalendarDays } from "lucide-react";
import { Button, Card, Heading, Text } from "../../../shared/components/primitives";
import { colors } from "../../../shared/theme";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const ScheduleCard = ({ suggestion, onConfirm, onOther, disabled }) => (
  <Card
    radius="4xl"
    padding={14}
    clip={false}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-12)",
      boxShadow: "var(--shadow-card-glow)",
      boxSizing: "border-box",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)" }}>
      <div
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-round)",
          background: "var(--color-primary-tint)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CalendarDays size={18} color={colors.foreground} />
      </div>
      <Text
        as="span"
        size="xs"
        weight={600}
        color={colors.mutedForeground}
        style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        Sugestão de horário
      </Text>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <Heading as="h3" size="lg" style={{ fontFamily: "var(--font-body)" }}>
        {capitalize(suggestion.dateLabel)}
      </Heading>
      <Text size="md">
        {suggestion.time} · {suggestion.service}
      </Text>
      <Text size="sm" color={colors.mutedForeground}>
        {suggestion.professionalName} · R$ {suggestion.price}
      </Text>
    </div>
    <div style={{ display: "flex", gap: "var(--space-8)" }}>
      <Button radius="xl" pad={12} size="md" disabled={disabled} onClick={onConfirm} style={{ minHeight: 44 }}>
        Confirmar
      </Button>
      <Button
        variant="secondary"
        radius="xl"
        pad={12}
        size="md"
        disabled={disabled}
        onClick={onOther}
        style={{ minHeight: 44 }}
      >
        Outro horário
      </Button>
    </div>
  </Card>
);
