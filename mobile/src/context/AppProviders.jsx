// Providers do app: consultas, busca, agendamento e provador (o agendamento é o mesmo contexto do web) · API: nenhuma
import { SchedulingProvider } from "@kira/context/SchedulingContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SearchProvider } from "./SearchContext";
import { TryOnProvider } from "./TryOnContext";

// mesmas regras do web: sem cache entre visitas e sem repetir erros sozinho
const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } } });

export function AppProviders({ children }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <SchedulingProvider>
          <TryOnProvider>{children}</TryOnProvider>
        </SchedulingProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}
