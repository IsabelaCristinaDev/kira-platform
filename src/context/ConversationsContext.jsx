// Conversa aberta: qual contato está selecionado ao ir da lista para a conversa · API: nenhuma
import { createContext, useContext, useMemo, useState } from "react";

const ConversationsContext = createContext(null);

export function ConversationsProvider({ children }) {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const value = useMemo(() => ({ selectedConversationId, setSelectedConversationId }), [selectedConversationId]);
  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export const useConversations = () => {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations precisa estar dentro de <ConversationsProvider>");
  return ctx;
};
