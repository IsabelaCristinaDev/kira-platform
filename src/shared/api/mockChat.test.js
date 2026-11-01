// Testes do gateway mock do chat (respostas roteirizadas, transferência e falha de envio) · API: nenhuma
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "./contract";
import { createMockChat, planReply } from "./mockChat";

const timing = { load: 10, send: 10, typing: 10, reply: 10, handoff: 50 };
let chat;
let events;

beforeEach(() => {
  vi.useFakeTimers();
  chat = createMockChat(timing);
  events = [];
  chat.subscribe((event) => events.push(event));
});
afterEach(() => {
  chat.dispose();
  vi.useRealTimers();
});

const settle = async (promise, ms) => {
  const result = promise.then(
    (value) => ({ value }),
    (error) => ({ error }),
  );
  await vi.advanceTimersByTimeAsync(ms);
  return result;
};
const kinds = () => events.map((e) => (e.type === "message" ? `message:${e.message.type}` : e.type));

describe("planReply", () => {
  const ai = { agent: "ai", now: new Date(2026, 9, 26) };

  it("sugere profissional, cartão e respostas rápidas para quem procura corte", () => {
    const { messages } = planReply("Quero um corte de cabelo perto de mim", ai);
    expect(messages.map((m) => m.type)).toEqual(["text", "professional", "quick_replies"]);
  });
  it("mostra o cartão de agendamento ao pedir horários", () => {
    const { messages } = planReply("Ver horários", ai);
    expect(messages.map((m) => m.type)).toEqual(["text", "scheduling"]);
    expect(messages[1].suggestion.time).toMatch(/^\d{2}:\d{2}$/);
  });
  it("pedir uma pessoa dispara a transferência", () => {
    expect(planReply("Falar com atendente", ai)).toEqual({ handoff: true });
    expect(planReply("quero falar com uma pessoa", ai)).toEqual({ handoff: true });
  });
  it("com o atendente na conversa, quem responde é ele", () => {
    const { messages } = planReply("Meu horário continua confirmado?", { agent: "human" });
    expect(messages[0].author).toBe("human");
  });
  it("sem entender, oferece caminhos em respostas rápidas", () => {
    const { messages } = planReply("asdfgh", ai);
    expect(messages.at(-1).type).toBe("quick_replies");
  });
});

describe("createMockChat", () => {
  it("começa com a conversa vazia, com a IA atendendo", async () => {
    const { value } = await settle(chat.load(), 10);
    expect(value).toEqual({ messages: [], agent: "ai", handoff: "none" });
  });

  it("responde com digitando e depois com as mensagens", async () => {
    const { value } = await settle(chat.send("Quero um corte de cabelo"), 10);
    expect(value).toMatchObject({ author: "user", delivery: "sent" });
    await vi.advanceTimersByTimeAsync(20);
    expect(kinds()).toEqual(["typing", "typing", "message:text", "message:professional", "message:quick_replies"]);
    expect(events.filter((e) => e.type === "typing").map((e) => e.on)).toEqual([true, false]);
  });

  it("guarda a conversa para quando a tela for reaberta", async () => {
    await settle(chat.send("Ver horários"), 10);
    await vi.advanceTimersByTimeAsync(20);
    const { value } = await settle(chat.load(), 10);
    expect(value.messages.map((m) => m.author)).toEqual(["user", "ai", "ai"]);
  });

  it("transfere para o atendente: espera, entra e avisa", async () => {
    await settle(chat.requestHandoff(), 10);
    expect(kinds()).toEqual(["message:system", "handoff"]);
    expect(events.at(-1)).toEqual({ type: "handoff", state: "waiting" });

    await vi.advanceTimersByTimeAsync(50);
    expect(events).toContainEqual({ type: "handoff", state: "connected" });
    expect(events).toContainEqual({ type: "agent", agent: "human" });

    await vi.advanceTimersByTimeAsync(20);
    const last = events.at(-1);
    expect(last.message).toMatchObject({ author: "human" });
    expect(last.message.text).toContain("nossa inteligência artificial");
  });

  it("mantém a assistente pausada enquanto espera o atendente", async () => {
    await settle(chat.requestHandoff(), 10);
    const before = events.length;
    await settle(chat.send("alguém aí?"), 10);
    await vi.advanceTimersByTimeAsync(20);
    expect(events.slice(before).some((e) => e.type === "message")).toBe(false);
  });

  it("cancelar a espera volta para a IA e o atendente não entra", async () => {
    await settle(chat.requestHandoff(), 10);
    await settle(chat.cancelHandoff(), 10);
    expect(events).toContainEqual({ type: "handoff", state: "none" });
    await vi.advanceTimersByTimeAsync(100);
    expect(events).not.toContainEqual({ type: "handoff", state: "connected" });
  });

  it("falha na primeira tentativa de uma mensagem com erro e passa na repetição", async () => {
    const first = await settle(chat.send("teste de erro"), 10);
    expect(first.error).toBeInstanceOf(ApiError);
    expect(first.error.code).toBe("chat_send_failed");
    const second = await settle(chat.send("teste de erro"), 10);
    expect(second.value).toMatchObject({ author: "user" });
  });
});
