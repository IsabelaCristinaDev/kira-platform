// Service worker: mostra a notificação de mensagem nova e abre a conversa ao tocar · dados: push do kira-backend (titulo, corpo, agendamentoId) · API: Push e Notifications do navegador
// Fica em public/ para ser servido na raiz, com nome fixo e sem passar pelo bundler: por isso não importa nada de src/.
// As mensagens e o endereço abaixo são os de src/shared/notifications/conversationLink.js (o teste confere).
const ASK_CONVERSATION_OPEN = "kira:conversa-aberta";
const OPEN_CONVERSATION = "kira:abrir-conversa";
const OPEN_CONVERSATION_PATH = "conversa";
const APPOINTMENT_PARAM = "agendamento";

const ASK_TIMEOUT_MS = 500;
const DEFAULT_TITLE = "Kira";

const readPayload = (event) => {
  try {
    return event.data?.json() ?? {};
  } catch {
    return {};
  }
};

const appWindows = () => self.clients.matchAll({ type: "window", includeUncontrolled: true });

// Só a tela sabe qual conversa está aberta (vem do contexto, não da URL). Sem resposta, vale como não aberta.
const askWindow = (client, agendamentoId) =>
  new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    const timer = setTimeout(() => resolve(false), ASK_TIMEOUT_MS);
    port1.onmessage = ({ data }) => {
      clearTimeout(timer);
      resolve(data === true);
    };
    client.postMessage({ type: ASK_CONVERSATION_OPEN, agendamentoId }, [port2]);
  });

const isConversationVisible = async (agendamentoId) => {
  const visible = (await appWindows()).filter((client) => client.visibilityState === "visible");
  const answers = await Promise.all(visible.map((client) => askWindow(client, agendamentoId)));
  return answers.some(Boolean);
};

// Mostra só o que o backend mandou: o que vai no texto é decisão do backend
const showMessage = async ({ titulo, corpo, agendamentoId }) => {
  if (agendamentoId && (await isConversationVisible(agendamentoId).catch(() => false))) return;
  await self.registration.showNotification(titulo || DEFAULT_TITLE, {
    body: corpo,
    data: { agendamentoId },
    // Uma notificação por conversa: a mensagem nova substitui a anterior e avisa de novo
    ...(agendamentoId ? { tag: `conversa-${agendamentoId}`, renotify: true } : {}),
  });
};

const bestWindow = (windows) =>
  windows.find((client) => client.focused) ??
  windows.find((client) => client.visibilityState === "visible") ??
  windows[0];

const conversationUrl = (agendamentoId) => {
  const url = new URL(agendamentoId ? OPEN_CONVERSATION_PATH : "", self.registration.scope);
  if (agendamentoId) url.searchParams.set(APPOINTMENT_PARAM, agendamentoId);
  return url.href;
};

// Com o app aberto, a própria aba navega e não perde o estado; fechado, o endereço diz qual conversa abrir
const openConversation = async (agendamentoId) => {
  const client = bestWindow(await appWindows());
  if (!client) return self.clients.openWindow(conversationUrl(agendamentoId));
  if (agendamentoId) client.postMessage({ type: OPEN_CONVERSATION, agendamentoId });
  return client.focus();
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("push", (event) => event.waitUntil(showMessage(readPayload(event))));
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(openConversation(event.notification.data?.agendamentoId));
});
