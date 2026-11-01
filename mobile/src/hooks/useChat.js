// Estado e ações do chat de atendimento no app (mesma lógica do web, com a conexão vinda do NetInfo) · api.chat
import { api } from "@kira/shared/api";
import { AUTHORS, DELIVERY, HANDOFF_STATES, MESSAGE_TYPES } from "@kira/shared/api/chatContract";
import { chatReducer, initialChatState } from "@kira/client/chat/chatReducer";
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

// Mantido em paralelo ao src/client/hooks/useChat.js do web. Só muda o ouvinte de conexão.
// Próximo passo: extrair a parte comum para src/shared quando o web puder ser alterado.
export function useChat(gateway = api.chat) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(state);
  const localIds = useRef(0);

  useEffect(() => {
    latest.current = state;
  });

  // carrega a conversa e passa a ouvir os eventos; a inscrição vem antes para não perder nada no caminho
  useEffect(() => {
    let active = true;
    dispatch({ type: "loading" });
    const unsubscribe = gateway.subscribe((event) => active && dispatch(event));
    gateway
      .load()
      .then((conversation) => active && dispatch({ type: "loaded", conversation }))
      .catch(() => active && dispatch({ type: "load_failed" }));
    return () => {
      active = false;
      unsubscribe();
    };
  }, [gateway, attempt]);

  useEffect(
    () => NetInfo.addEventListener((net) => dispatch({ type: "online", value: net.isConnected !== false })),
    [],
  );

  const deliver = useCallback(
    async (message) => {
      dispatch({ type: "patch", id: message.id, patch: { delivery: DELIVERY.SENDING } });
      try {
        const saved = await gateway.send(message.text);
        dispatch({ type: "replace", id: message.id, message: saved });
      } catch {
        dispatch({ type: "patch", id: message.id, patch: { delivery: DELIVERY.FAILED } });
      }
    },
    [gateway],
  );

  // mensagens escritas sem conexão saem sozinhas quando a internet volta
  useEffect(() => {
    if (!state.online) return;
    state.messages.filter((m) => m.delivery === DELIVERY.QUEUED).forEach(deliver);
  }, [state.online, state.messages, deliver]);

  const send = useCallback(
    (raw) => {
      const text = raw.trim();
      if (!text) return;
      localIds.current += 1;
      const online = latest.current.online;
      const message = {
        id: `local-${localIds.current}`,
        type: MESSAGE_TYPES.TEXT,
        author: AUTHORS.USER,
        text,
        createdAt: new Date().toISOString(),
        delivery: online ? DELIVERY.SENDING : DELIVERY.QUEUED,
      };
      dispatch({ type: "message", message });
      if (online) deliver(message);
    },
    [deliver],
  );

  const retry = useCallback(
    (id) => {
      const message = latest.current.messages.find((m) => m.id === id);
      if (message) deliver(message);
    },
    [deliver],
  );

  const requestHandoff = useCallback(async () => {
    dispatch({ type: "handoff", state: HANDOFF_STATES.WAITING });
    try {
      await gateway.requestHandoff();
    } catch {
      dispatch({ type: "handoff", state: HANDOFF_STATES.NONE });
    }
  }, [gateway]);

  const cancelHandoff = useCallback(async () => {
    dispatch({ type: "handoff", state: HANDOFF_STATES.NONE });
    try {
      await gateway.cancelHandoff();
    } catch {
      dispatch({ type: "handoff", state: HANDOFF_STATES.WAITING });
    }
  }, [gateway]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, send, retry, requestHandoff, cancelHandoff, reload };
}
