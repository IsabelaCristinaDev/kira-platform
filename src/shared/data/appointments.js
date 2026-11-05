// Rótulo e cor de cada status de agendamento do backend · sem API
import { colors } from "../theme";

export const appointmentStatus = {
  PENDENTE: { label: "Aguardando confirmação", color: colors.accent },
  CONFIRMADO: { label: "✓ Confirmado", color: colors.primaryText },
  REAGENDADO: { label: "Reagendado", color: colors.primaryText },
  CONCLUIDO: { label: "Concluído", color: colors.mutedForeground },
  CANCELADO: { label: "Cancelado", color: colors.destructiveText },
};

export const statusOf = (appointment) => appointmentStatus[appointment.rawStatus] ?? appointmentStatus.PENDENTE;
