// Testes do reducer do chat (carregar, receber, enviar com retentativa, transferência e conexão) · API: nenhuma
import { describe, expect, it } from "vitest";
import { chatReducer, initialChatState } from "./chatReducer";

const msg = (id, extra) => ({
  id,
  type: "text",
  author: "user",
  text: id,
  createdAt: "2026-10-26T14:00:00.000Z",
  ...extra,
});
const ready = (messages = []) =>
  chatReducer(initialChatState, { type: "loaded", conversation: { messages, agent: "ai", handoff: "none" } });

describe("chatReducer", () => {
  it("começa carregando e passa a pronto com a conversa carregada", () => {
    expect(initialChatState.status).toBe("loading");
    const state = chatReducer(initialChatState, {
      type: "loaded",
      conversation: { messages: [msg("a")], agent: "human", handoff: "connected" },
    });
    expect(state).toMatchObject({ status: "ready", agent: "human", handoff: "connected" });
    expect(state.messages).toHaveLength(1);
  });

  it("falha ao carregar e volta a carregar mantendo a conexão", () => {
    const failed = chatReducer({ ...initialChatState, online: false }, { type: "load_failed" });
    expect(failed.status).toBe("error");
    expect(chatReducer(failed, { type: "loading" })).toMatchObject({ status: "loading", online: false });
  });

  it("acrescenta mensagens e ignora repetidas", () => {
    let state = ready();
    state = chatReducer(state, { type: "message", message: msg("a") });
    state = chatReducer(state, { type: "message", message: msg("a") });
    expect(state.messages).toHaveLength(1);
  });

  it("marca a falha, tenta de novo e troca pela mensagem confirmada na mesma posição", () => {
    let state = ready([msg("local-1", { delivery: "sending" }), msg("b")]);
    state = chatReducer(state, { type: "patch", id: "local-1", patch: { delivery: "failed" } });
    expect(state.messages[0].delivery).toBe("failed");
    state = chatReducer(state, { type: "replace", id: "local-1", message: msg("msg-9", { delivery: "sent" }) });
    expect(state.messages.map((m) => m.id)).toEqual(["msg-9", "b"]);
  });

  it("acompanha digitando, quem atende, transferência e conexão", () => {
    let state = ready();
    state = chatReducer(state, { type: "typing", on: true });
    state = chatReducer(state, { type: "handoff", state: "waiting" });
    state = chatReducer(state, { type: "agent", agent: "human" });
    state = chatReducer(state, { type: "online", value: false });
    expect(state).toMatchObject({ typing: true, handoff: "waiting", agent: "human", online: false });
  });

  it("ignora ação desconhecida", () => {
    const state = ready();
    expect(chatReducer(state, { type: "x" })).toBe(state);
  });
});
