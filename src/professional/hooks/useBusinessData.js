// Dados do estúdio logado: agendamentos (com o preço do serviço), serviços e avaliações · API: kira-backend
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api";

export const useBusinessAppointments = () =>
  useQuery({ queryKey: ["appointments", "business"], queryFn: api.appointments.listForMyBusiness });

export function useBusinessData() {
  const appointments = useBusinessAppointments();
  const services = useQuery({ queryKey: ["services", "business"], queryFn: api.services.listForMyBusiness });
  const reviews = useQuery({ queryKey: ["reviews", "business"], queryFn: api.reviews.listForMyBusiness });
  const queries = [appointments, services, reviews];
  // O agendamento não traz o preço: vem do serviço cadastrado
  const priceById = new Map((services.data ?? []).map((s) => [s.id, s.price]));
  return {
    appointments: (appointments.data ?? []).map((a) => ({ ...a, price: priceById.get(a.serviceId) ?? null })),
    reviews: reviews.data ?? [],
    loading: queries.some((q) => q.isLoading),
    error: queries.find((q) => q.isError)?.error ?? null,
    retry: () => queries.filter((q) => q.isError).forEach((q) => q.refetch()),
  };
}

// Painel pronto do backend. `from` e `to` são Date; sem eles, vale do dia 1º do mês até hoje.
export const useDashboard = ({ from = null, to = null } = {}) =>
  useQuery({
    queryKey: ["dashboard", from?.toDateString() ?? null, to?.toDateString() ?? null],
    queryFn: () => api.dashboard.getMine({ from, to }),
  });

// Horário de funcionamento do estúdio logado (semana inteira, segunda primeiro)
export const useBusinessHours = () => useQuery({ queryKey: ["businessHours"], queryFn: api.businessHours.getMine });
