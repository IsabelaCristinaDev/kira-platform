// Dias que podem ser agendados em um estúdio: de hoje em diante e dentro do horário de funcionamento · API: kira-backend (GET /api/empresas/{id}/disponibilidade)
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { startOfDay } from "../utils/date";
import { isOpenOn } from "../utils/businessHours";

export function useBookableDays(proId) {
  const hours = useQuery({
    queryKey: ["businessHours", proId],
    queryFn: () => api.businessHours.get(proId),
    enabled: !!proId,
  });
  const today = startOfDay(new Date());
  return (date) => date >= today && isOpenOn(hours.data, date);
}
