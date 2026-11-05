// Lista de conversas e não lidas, atualizadas ao vivo enquanto há sessão · API: kira-backend (api.messages)
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../shared/api";
import { totalUnread } from "../shared/utils/chatMessages";
import { useSession } from "./SessionContext";

// Sem conexão em tempo real, a lista continua atualizando por consulta
const FALLBACK_REFETCH_MS = 30000;

const ConversationsContext = createContext(null);

// Um provider só: o menu e a lista usam a mesma conexão e os mesmos dados
export function ConversationsProvider({ children }) {
  const { auth } = useSession();
  const userId = auth?.id ?? null;
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [lastReceived, setLastReceived] = useState(null);

  const query = useQuery({
    queryKey: ["conversations", userId],
    queryFn: api.messages.listConversations,
    enabled: !!userId,
    refetchInterval: userId && !connected ? FALLBACK_REFETCH_MS : false,
  });

  useEffect(() => {
    if (!userId) return undefined;
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
    const stop = api.messages.subscribeToChanges({
      onChange: ({ message }) => {
        refresh();
        if (message && !message.mine) setLastReceived(message);
      },
      onStatus: (up) => {
        setConnected(up);
        if (up) refresh();
      },
    });
    return () => {
      stop();
      setConnected(false);
      setLastReceived(null);
    };
  }, [userId, queryClient]);

  const value = useMemo(() => {
    const conversations = query.data ?? [];
    return {
      conversations,
      totalUnread: totalUnread(conversations),
      // Última mensagem recebida, para mostrar um aviso na tela; repete só quando chega outra
      lastReceived,
      connected,
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch,
    };
  }, [query.data, query.isLoading, query.error, query.refetch, lastReceived, connected]);

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export const useConversations = () => {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations precisa estar dentro de <ConversationsProvider>");
  return ctx;
};
