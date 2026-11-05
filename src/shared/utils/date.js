// Início do mês e do dia de uma data · funções puras
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
