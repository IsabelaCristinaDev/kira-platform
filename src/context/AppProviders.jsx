// Providers do app na ordem das dependências: consultas, sessão, cadastro, busca, agendamento, provador, painel · API: nenhuma
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ConversationsProvider } from "./ConversationsContext";
import { ProDashboardProvider } from "./ProDashboardContext";
import { SchedulingProvider } from "./SchedulingContext";
import { SearchProvider } from "./SearchContext";
import { SessionProvider } from "./SessionContext";
import { SignupProvider } from "./SignupContext";
import { TryOnProvider } from "./TryOnContext";
import { WebPushBridge } from "./WebPushBridge";

// Dados valem 30 s entre telas (a lista de estúdios faz uma chamada por estúdio) e não recarregam ao
// focar a janela. Erros não repetem sozinhos (há botão "Tentar de novo").
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 30_000, refetchOnWindowFocus: false },
    },
  });

export function AppProviders({ children }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ConversationsProvider>
          <SignupProvider>
            <SearchProvider>
              <SchedulingProvider>
                <WebPushBridge />
                <TryOnProvider>
                  <ProDashboardProvider>{children}</ProDashboardProvider>
                </TryOnProvider>
              </SchedulingProvider>
            </SearchProvider>
          </SignupProvider>
        </ConversationsProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
