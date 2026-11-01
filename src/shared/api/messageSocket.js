// Chat em tempo real: STOMP sobre WebSocket, com reconexão e token renovado · API: kira-backend (/ws)
import { Client } from "@stomp/stompjs";
import { authStore, refreshToken, webSocketUrl } from "./http";

// Devolve a função que encerra a conexão. `onStatus(true)` a cada conexão aberta: quem usa busca os
// dados de novo para pegar o que chegou enquanto estava desconectado.
const subscribeTo = (destination, { onData, onStatus }) => {
  const client = new Client({
    brokerURL: webSocketUrl(),
    reconnectDelay: 3000,
    beforeConnect: () => {
      client.connectHeaders = { Authorization: `Bearer ${authStore.get()?.token}` };
    },
    onConnect: () => {
      client.subscribe(destination, (frame) => onData(JSON.parse(frame.body)));
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
};

// Mensagens de uma conversa aberta
export const subscribeToConversation = (appointmentId, { onMessage, onStatus }) =>
  subscribeTo(`/topic/agendamentos/${appointmentId}/mensagens`, { onData: onMessage, onStatus });

// Canal da pessoa: avisa quando a lista de conversas muda, mesmo sem nenhuma conversa aberta
export const subscribeToUserChannel = (userId, { onNotice, onStatus }) =>
  subscribeTo(`/topic/usuarios/${userId}/conversas`, { onData: onNotice, onStatus });
