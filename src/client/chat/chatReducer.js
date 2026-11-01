// Estado do chat como reducer puro (carregando, mensagens, quem atende, transferência, digitando, conexão) · API: nenhuma
import { CHAT_AGENTS, CHAT_STATUS, HANDOFF_STATES } from "../../shared/api/chatContract";

export const initialChatState = {
  status: CHAT_STATUS.LOADING,
  messages: [],
  agent: CHAT_AGENTS.AI,
  handoff: HANDOFF_STATES.NONE,
  typing: false,
  online: true,
};

/**
 * As ações "message", "typing", "agent" e "handoff" têm o mesmo formato dos eventos do gateway.
 * @param {typeof initialChatState} state
 * @param {{ type: string } & Record<string, any>} action
 */
export function chatReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...initialChatState, online: state.online };
    case "loaded":
      return {
        ...state,
        status: CHAT_STATUS.READY,
        messages: action.conversation.messages,
        agent: action.conversation.agent,
        handoff: action.conversation.handoff,
      };
    case "load_failed":
      return { ...state, status: CHAT_STATUS.ERROR };
    case "message":
      if (state.messages.some((m) => m.id === action.message.id)) return state;
      return { ...state, messages: [...state.messages, action.message] };
    case "patch":
      return { ...state, messages: state.messages.map((m) => (m.id === action.id ? { ...m, ...action.patch } : m)) };
    case "replace":
      return { ...state, messages: state.messages.map((m) => (m.id === action.id ? action.message : m)) };
    case "typing":
      return { ...state, typing: action.on };
    case "agent":
      return { ...state, agent: action.agent };
    case "handoff":
      return { ...state, handoff: action.state };
    case "online":
      return { ...state, online: action.value };
    default:
      return state;
  }
}
