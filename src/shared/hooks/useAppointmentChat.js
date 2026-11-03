// Conversa do agendamento entre cliente e estúdio: carrega, recebe em tempo real, envia e marca como lida · API: kira-backend (api.messages)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { mergeMessage } from "../utils/chatMessages";

// Sem conexão em tempo real, a conversa continua atualizando por consulta
const FALLBACK_REFETCH_MS = 10000;

// Uma busca em andamento pode ter saído antes desta mensagem e apagá-la ao terminar, e com a conexão
// aberta não há outra consulta para trazê-la de volta. Por isso a busca recomeça já com a mensagem salva.
export const addMessageToChat = (queryClient, appointmentId, message) => {
  const queryKey = ["messages", appointmentId];
  const fetching = queryClient.isFetching({ queryKey }) > 0;
  // Na primeira carga ainda não há lista, e a busca só recomeça se a consulta já tiver dados
  queryClient.setQueryData(queryKey, (list) => (list || fetching ? mergeMessage(list ?? [], message) : undefined));
  if (fetching) queryClient.invalidateQueries({ queryKey });
};

export function useAppointmentChat(appointmentId) {
  const queryClient = useQueryClient();
  // null: ainda abrindo a primeira conexão, sem motivo para avisar
  const [connected, setConnected] = useState(null);

  const messages = useQuery({
    queryKey: ["messages", appointmentId],
    queryFn: () => api.messages.listByAppointment(appointmentId),
    refetchInterval: connected ? false : FALLBACK_REFETCH_MS,
  });

  const addMessage = useCallback(
    (message) => addMessageToChat(queryClient, appointmentId, message),
    [appointmentId, queryClient],
  );

  useEffect(
    () =>
      api.messages.subscribe(appointmentId, {
        onMessage: addMessage,
        onStatus: (up) => {
          setConnected(up);
          if (up) queryClient.invalidateQueries({ queryKey: ["messages", appointmentId] });
        },
      }),
    [appointmentId, addMessage, queryClient],
  );

  const send = useMutation({
    mutationFn: (text) => api.messages.send({ appointmentId, text }),
    onSuccess: addMessage,
  });

  // Conta em vez de sim/não: mensagem nova com outra ainda não lida também dispara
  const unread = (messages.data ?? []).filter((m) => !m.mine && !m.read).length;
  useEffect(() => {
    if (unread === 0) return;
    api.messages
      .markAllRead(appointmentId)
      .then(() => queryClient.invalidateQueries({ queryKey: ["messages", appointmentId] }))
      .catch(() => {}); // fica como não lida; a conversa funciona igual
  }, [appointmentId, unread, queryClient]);

  return { messages, send, connected };
}
