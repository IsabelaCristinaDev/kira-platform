// Conversa de um agendamento em tempo real: STOMP sobre WebSocket, com reconexão e token renovado · API: kira-backend (/ws)
import { Client } from "@stomp/stompjs";
import { authStore, refreshToken, webSocketUrl } from "./http";

// Devolve a função que encerra a conexão. `onStatus(true)` a cada conexão aberta: a tela busca a
// conversa de novo para pegar o que chegou enquanto estava desconectada.
export function subscribeToConversation(appointmentId, { onMessage, onStatus }) {
  const client = new Client({
    brokerURL: webSocketUrl(),
    reconnectDelay: 3000,
    beforeConnect: () => {
      client.connectHeaders = { Authorization: `Bearer ${authStore.get()?.token}` };
    },
    onConnect: () => {
      client.subscribe(`/topic/agendamentos/${appointmentId}/mensagens`, (frame) => onMessage(JSON.parse(frame.body)));
      onStatus(true);
    },
    onWebSocketClose: () => onStatus(false),
    // Token vencido: renova, e a próxima tentativa já usa o novo. Outra recusa não adianta repetir.
    onStompError: async (frame) => {
      const expired = frame.headers.message?.startsWith("Token");
      const canRetry = expired && (await refreshToken().catch(() => true));
      if (!canRetry) client.deactivate();
    },
  });
  client.activate();
  return () => client.deactivate();
}
