// Gateway mock do chat: respostas roteirizadas da IA e do atendente, com latência simulada · mock · futuro: adaptador do n8n
import { mockProfessionals } from "../data/professionals";
import { AUTHORS, CHAT_AGENTS, DELIVERY, HANDOFF_STATES, MESSAGE_TYPES } from "./chatContract";
import { ApiError } from "./contract";

export const defaultTiming = { load: 700, send: 450, typing: 600, reply: 1400, handoff: 2400 };

const HUMAN_NAME = "Júlia, equipe Kira";
const featuredPro = mockProfessionals[0];
const alternativePro = mockProfessionals[1];

const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const dayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });
const suggestedDay = (now) => {
  const date = new Date(now);
  date.setDate(date.getDate() + 3);
  return dayFormat.format(date);
};

const say = (author, text, extra) => ({ type: MESSAGE_TYPES.TEXT, author, text, ...extra });
const system = (text) => ({ type: MESSAGE_TYPES.SYSTEM, author: AUTHORS.SYSTEM, text });
const quickReplies = (options) => ({ type: MESSAGE_TYPES.QUICK_REPLIES, author: AUTHORS.AI, options });
const professional = (pro) => ({ type: MESSAGE_TYPES.PROFESSIONAL, author: AUTHORS.AI, professional: pro });
const suggestion = (pro, now, slot = 2) => ({
  type: MESSAGE_TYPES.SCHEDULING,
  author: AUTHORS.AI,
  suggestion: {
    professionalName: pro.name,
    service: "Corte feminino",
    dateLabel: suggestedDay(now),
    time: pro.schedule[slot],
    price: pro.price,
  },
});

/**
 * Decide a resposta ao que o usuário escreveu. Função pura: a conversa de demonstração inteira está aqui.
 * @returns {{ handoff: true } | { messages: object[] }}
 */
export const planReply = (input, { agent, now = new Date() }) => {
  const t = normalize(input);
  if (agent === CHAT_AGENTS.HUMAN) {
    return {
      messages: [
        say(AUTHORS.HUMAN, "Entendi! Já estou conferindo isso para você, um instante.", { authorName: HUMAN_NAME }),
      ],
    };
  }
  if (/atendente|pessoa|humano|alguem da equipe/.test(t)) return { handoff: true };
  if (/outro/.test(t)) {
    return {
      messages: [say(AUTHORS.AI, "Sem problema! Que tal este?"), suggestion(featuredPro, now, 3)],
    };
  }
  if (/outra|outras/.test(t)) {
    return {
      messages: [
        say(AUTHORS.AI, "Claro! Esta é outra opção bem avaliada perto de você:"),
        professional(alternativePro),
        quickReplies(["Ver horários", "Quanto custa?"]),
      ],
    };
  }
  if (/confirm/.test(t)) {
    return {
      messages: [
        say(
          AUTHORS.AI,
          `Pronto! Seu horário com ${featuredPro.name} está confirmado. Avisamos por notificação antes do atendimento.`,
        ),
      ],
    };
  }
  if (/horario|agendar|agenda/.test(t)) {
    return {
      messages: [say(AUTHORS.AI, `${featuredPro.name} tem este horário livre:`), suggestion(featuredPro, now)],
    };
  }
  if (/custa|preco|valor/.test(t)) {
    return {
      messages: [
        say(AUTHORS.AI, `${featuredPro.name} cobra a partir de R$ ${featuredPro.price}. Quer ver os horários?`),
        quickReplies(["Ver horários", "Outras opções"]),
      ],
    };
  }
  if (/profission|cabelo|corte|perto|encontrar/.test(t)) {
    return {
      messages: [
        say(AUTHORS.AI, "Achei uma profissional bem avaliada pertinho de você:"),
        professional(featuredPro),
        quickReplies(["Ver horários", "Outras opções", "Quanto custa?"]),
      ],
    };
  }
  if (/duvida|ajuda|como/.test(t)) {
    return {
      messages: [
        say(AUTHORS.AI, "Claro! Me conte sua dúvida. Se preferir, chamo alguém da equipe."),
        quickReplies(["Como altero um agendamento?", "Falar com atendente"]),
      ],
    };
  }
  return {
    messages: [
      say(
        AUTHORS.AI,
        "Posso te ajudar a encontrar profissionais, agendar horários ou tirar dúvidas. Por onde quer começar?",
      ),
      quickReplies(["Encontrar um profissional", "Agendar um horário", "Tirar uma dúvida"]),
    ],
  };
};

/**
 * Cria um gateway mock isolado (a conversa fica na memória, então voltar à tela retoma de onde parou).
 * Digite "erro" em uma mensagem para ver a falha de envio: a primeira tentativa falha e a repetição passa.
 * @param {typeof defaultTiming} [timing]
 * @returns {import("./chatContract").ChatGateway & { dispose: () => void }}
 */
export function createMockChat(timing = defaultTiming) {
  const listeners = new Set();
  const timers = new Set();
  const store = [];
  const failedOnce = new Set();
  let agent = CHAT_AGENTS.AI;
  let handoff = HANDOFF_STATES.NONE;
  let handoffRun = 0; // cancelar a transferência invalida os passos que ainda estão agendados
  let seq = 0;

  const later = (ms, fn) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };
  const wait = (ms) => new Promise((resolve) => later(ms, resolve));
  const emit = (event) => listeners.forEach((listener) => listener(event));
  const build = (partial) => ({ id: `msg-${++seq}`, createdAt: new Date().toISOString(), ...partial });
  const publish = (partial) => {
    const message = build(partial);
    store.push(message);
    emit({ type: "message", message });
  };
  const setHandoff = (state) => {
    handoff = state;
    emit({ type: "handoff", state });
  };
  const setAgent = (next) => {
    agent = next;
    emit({ type: "agent", agent: next });
  };

  // "digitando..." e depois as mensagens, como um atendimento de verdade
  const speak = (messages, delay = 0) => {
    later(delay + timing.typing, () => emit({ type: "typing", on: true }));
    later(delay + timing.typing + timing.reply, () => {
      emit({ type: "typing", on: false });
      messages.forEach(publish);
    });
    return delay + timing.typing + timing.reply;
  };

  const startHandoff = () => {
    const run = ++handoffRun;
    const active = (fn) => () => run === handoffRun && fn();
    publish(system("Você pediu para falar com um atendente"));
    setHandoff(HANDOFF_STATES.WAITING);
    later(
      timing.handoff,
      active(() => {
        setHandoff(HANDOFF_STATES.CONNECTED);
        setAgent(CHAT_AGENTS.HUMAN);
        publish(system("Você agora está falando com um atendente"));
        later(
          timing.typing,
          active(() => emit({ type: "typing", on: true })),
        );
        later(
          timing.typing + timing.reply,
          active(() => {
            emit({ type: "typing", on: false });
            publish(
              say(
                AUTHORS.HUMAN,
                "Oi! Aqui é a Júlia, da equipe Kira. Já li a sua conversa com a nossa inteligência artificial e vou te ajudar por aqui.",
                { authorName: HUMAN_NAME },
              ),
            );
          }),
        );
      }),
    );
  };

  const reply = (input) => {
    if (handoff === HANDOFF_STATES.WAITING) return; // a assistente fica pausada até o atendente entrar
    const plan = planReply(input, { agent });
    if (plan.handoff) {
      const spoke = speak([
        say(
          AUTHORS.AI,
          "Claro! Vou chamar alguém da equipe. Já passei o que você me contou, então não precisa repetir.",
        ),
      ]);
      later(spoke + 300, startHandoff);
      return;
    }
    speak(plan.messages);
  };

  return {
    load: async () => {
      await wait(timing.load);
      return { messages: [...store], agent, handoff };
    },
    send: async (text) => {
      await wait(timing.send);
      const key = normalize(text);
      if (/erro/.test(key) && !failedOnce.has(key)) {
        failedOnce.add(key);
        throw new ApiError("chat_send_failed");
      }
      const message = build({ type: MESSAGE_TYPES.TEXT, author: AUTHORS.USER, text, delivery: DELIVERY.SENT });
      store.push(message);
      reply(text);
      return message;
    },
    requestHandoff: async () => {
      await wait(timing.send);
      if (handoff === HANDOFF_STATES.NONE && agent === CHAT_AGENTS.AI) startHandoff();
    },
    cancelHandoff: async () => {
      await wait(timing.send);
      if (handoff !== HANDOFF_STATES.WAITING) return;
      handoffRun += 1;
      setHandoff(HANDOFF_STATES.NONE);
      publish(system("Você voltou a falar com a nossa inteligência artificial"));
      publish(say(AUTHORS.AI, "Que bom ter você de volta! Como posso ajudar?"));
      publish(quickReplies(["Encontrar um profissional", "Agendar um horário", "Tirar uma dúvida"]));
    },
    subscribe: (onEvent) => {
      listeners.add(onEvent);
      return () => listeners.delete(onEvent);
    },
    dispose: () => {
      timers.forEach(clearTimeout);
      timers.clear();
      listeners.clear();
    },
  };
}

export const mockChat = createMockChat();
