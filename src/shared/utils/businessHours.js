// Horário de funcionamento: diz se o estúdio abre em uma data · API: nenhuma

// Na ordem de Date.getDay()
const DAY_KEYS = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

/** Sem o horário (carregando ou com erro), não bloqueia: os horários livres do dia decidem. */
export const isOpenOn = (week, date) => week?.find((d) => d.day === DAY_KEYS[date.getDay()])?.open ?? true;
