// Providers do app na ordem das dependências: sessão, cadastro, busca, agendamento, provador, painel · API: nenhuma
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ConversationsProvider } from "./ConversationsContext";
import { ProDashboardProvider } from "./ProDashboardContext";
import { SchedulingProvider } from "./SchedulingContext";
import { SearchProvider } from "./SearchContext";
import { SessionProvider } from "./SessionContext";
import { SignupProvider } from "./SignupContext";
import { TryOnProvider } from "./TryOnContext";

// Sem cache entre visitas e sem refetch ao focar a janela: cada entrada na tela carrega de novo,
// com o mesmo skeleton do protótipo. Erros não repetem sozinhos (há botão "Tentar de novo").
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0, refetchOnWindowFocus: false },
    },
  });

export function AppProviders({ children }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SignupProvider>
          <SearchProvider>
            <SchedulingProvider>
              <TryOnProvider>
                <ConversationsProvider>
                  <ProDashboardProvider>{children}</ProDashboardProvider>
                </ConversationsProvider>
              </TryOnProvider>
            </SchedulingProvider>
          </SearchProvider>
        </SignupProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
