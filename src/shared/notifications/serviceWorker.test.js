// Testes de public/sw.js: mostrar a notificação, não repetir e abrir a conversa · self do service worker simulado
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  appointmentIdFrom,
  ASK_CONVERSATION_OPEN,
  OPEN_CONVERSATION,
  OPEN_CONVERSATION_PATH,
} from "./conversationLink";

const source = readFileSync(new URL("../../../public/sw.js", import.meta.url), "utf8");
const SCOPE = "https://kira.test/";

// Carrega o arquivo real com um `self` falso e guarda os ouvintes
const loadWorker = (windows = []) => {
  const handlers = {};
  const self = {
    addEventListener: (type, fn) => {
      handlers[type] = fn;
    },
    skipWaiting: vi.fn(),
    registration: { scope: SCOPE, showNotification: vi.fn().mockResolvedValue(undefined) },
    clients: {
      matchAll: vi.fn().mockResolvedValue(windows),
      openWindow: vi.fn().mockResolvedValue(null),
      claim: vi.fn().mockResolvedValue(undefined),
    },
  };
  new Function("self", source)(self);
  const fire = async (type, event) => {
    let done;
    handlers[type]({ ...event, waitUntil: (p) => (done = p) });
    await done;
  };
  return {
    self,
    push: (data) => fire("push", { data: { json: () => data } }),
    pushRaw: (data) => fire("push", { data }),
    click: (notification) => fire("notificationclick", { notification: { close: vi.fn(), ...notification } }),
  };
};

// Janela que responde à pergunta do service worker
const appWindow = ({ answer, visibilityState = "visible", focused = false } = {}) => {
  const client = {
    visibilityState,
    focused,
    focus: vi.fn().mockResolvedValue(undefined),
    postMessage: vi.fn((message, ports) => {
      if (answer !== undefined) ports[0].postMessage(answer);
      ports?.[0].start?.();
    }),
  };
  return client;
};

const message = { titulo: "Ana", corpo: "Oi!", agendamentoId: "a1" };

describe("service worker", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.useRealTimers());

  it("as mensagens e o endereço são os mesmos do app", () => {
    expect(source).toContain(`"${ASK_CONVERSATION_OPEN}"`);
    expect(source).toContain(`"${OPEN_CONVERSATION}"`);
    expect(source).toContain(`OPEN_CONVERSATION_PATH = "${OPEN_CONVERSATION_PATH.slice(1)}"`);
  });

  describe("push", () => {
    it("mostra o que o backend mandou, sem mudar o texto", async () => {
      const { self, push } = loadWorker();
      await push(message);
      expect(self.registration.showNotification).toHaveBeenCalledWith("Ana", {
        body: "Oi!",
        data: { agendamentoId: "a1" },
        tag: "conversa-a1",
        renotify: true,
      });
    });
    it("conteúdo ilegível: mostra um aviso genérico, sem etiqueta", async () => {
      const { self, pushRaw } = loadWorker();
      await pushRaw({
        json: () => {
          throw new SyntaxError("x");
        },
      });
      const [title, options] = self.registration.showNotification.mock.calls[0];
      expect(title).toBe("Kira");
      expect(options.tag).toBeUndefined();
      expect(options.renotify).toBeUndefined();
    });
    it("push sem conteúdo também mostra", async () => {
      const { self, pushRaw } = loadWorker();
      await pushRaw(null);
      expect(self.registration.showNotification).toHaveBeenCalledTimes(1);
    });
    it("não repete com a conversa aberta e visível", async () => {
      const { self, push } = loadWorker([appWindow({ answer: true })]);
      await push(message);
      expect(self.registration.showNotification).not.toHaveBeenCalled();
    });
    it("mostra com o app aberto em outra tela", async () => {
      const client = appWindow({ answer: false });
      const { self, push } = loadWorker([client]);
      await push(message);
      expect(client.postMessage.mock.calls[0][0]).toEqual({ type: ASK_CONVERSATION_OPEN, agendamentoId: "a1" });
      expect(self.registration.showNotification).toHaveBeenCalled();
    });
    it("não pergunta para a aba escondida", async () => {
      const hidden = appWindow({ visibilityState: "hidden" });
      const { self, push } = loadWorker([hidden]);
      await push(message);
      expect(hidden.postMessage).not.toHaveBeenCalled();
      expect(self.registration.showNotification).toHaveBeenCalled();
    });
    it("basta uma janela com a conversa aberta", async () => {
      const { self, push } = loadWorker([appWindow({ answer: false }), appWindow({ answer: true })]);
      await push(message);
      expect(self.registration.showNotification).not.toHaveBeenCalled();
    });
    it("janela que não responde: mostra mesmo assim, no tempo limite", async () => {
      vi.useFakeTimers();
      const { self, push } = loadWorker([appWindow()]);
      const done = push(message);
      await vi.advanceTimersByTimeAsync(500);
      await done;
      expect(self.registration.showNotification).toHaveBeenCalled();
    });
    it("falha ao procurar as janelas: mostra mesmo assim", async () => {
      const { self, push } = loadWorker();
      self.clients.matchAll.mockRejectedValue(new Error("x"));
      await push(message);
      expect(self.registration.showNotification).toHaveBeenCalled();
    });
  });

  describe("toque na notificação", () => {
    const tapped = { data: { agendamentoId: "a1" } };

    it("app fechado: abre o endereço da conversa", async () => {
      const close = vi.fn();
      const { self, click } = loadWorker();
      await click({ ...tapped, close });
      expect(close).toHaveBeenCalled();
      const url = new URL(self.clients.openWindow.mock.calls[0][0]);
      expect(url.origin + url.pathname).toBe(`${SCOPE}conversa`);
      expect(appointmentIdFrom(url.search)).toBe("a1");
    });
    it("app aberto: avisa a janela e foca, sem abrir outra", async () => {
      const client = appWindow();
      const { self, click } = loadWorker([client]);
      await click(tapped);
      expect(client.postMessage).toHaveBeenCalledWith({ type: OPEN_CONVERSATION, agendamentoId: "a1" });
      expect(client.focus).toHaveBeenCalled();
      expect(self.clients.openWindow).not.toHaveBeenCalled();
    });
    it("escolhe a janela em foco, depois a visível", async () => {
      const hidden = appWindow({ visibilityState: "hidden" });
      const visible = appWindow();
      const focused = appWindow({ focused: true });
      await loadWorker([hidden, visible, focused]).click(tapped);
      expect(focused.focus).toHaveBeenCalled();
      expect(visible.focus).not.toHaveBeenCalled();
      await loadWorker([hidden, visible]).click(tapped);
      expect(visible.focus).toHaveBeenCalled();
    });
    it("sem agendamento: só abre o app", async () => {
      const { self, click } = loadWorker();
      await click({ data: {} });
      expect(self.clients.openWindow).toHaveBeenCalledWith(SCOPE);
    });
  });
});
