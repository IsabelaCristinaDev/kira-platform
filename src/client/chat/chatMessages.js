// Agrupa as mensagens do chat por dia e formata dia e hora · API: nenhuma
import { startOfDay } from "../../shared/utils/date";

const DAY_MS = 24 * 60 * 60 * 1000;
const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Hora da mensagem, ex.: "14:02". */
export const formatTime = (iso) => timeFormat.format(new Date(iso));

/** Rótulo do dia: "Hoje", "Ontem" ou a data. */
export const dayLabel = (iso, now = new Date()) => {
  const days = Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY_MS);
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return dateFormat.format(new Date(iso));
};

/**
 * Junta mensagens seguidas do mesmo dia sob um rótulo.
 * @param {import("../../shared/api/chatContract").ChatMessage[]} messages
 * @returns {{ key: string, label: string, messages: import("../../shared/api/chatContract").ChatMessage[] }[]}
 */
export const groupMessagesByDay = (messages, now = new Date()) => {
  const groups = [];
  for (const message of messages) {
    const label = dayLabel(message.createdAt, now);
    const last = groups.at(-1);
    if (last && last.label === label) last.messages.push(message);
    else groups.push({ key: `${label}-${message.id}`, label, messages: [message] });
  }
  return groups;
};
