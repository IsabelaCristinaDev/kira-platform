// Testes do endereço e da conversa aberta usados pela notificação · API: nenhuma
import { describe, expect, it } from "vitest";
import { pathFor } from "../../routes";
import {
  appointmentIdFrom,
  conversationLink,
  conversationScreenFor,
  isConversationOnScreen,
  OPEN_CONVERSATION_PATH,
} from "./conversationLink";

const onScreen = { screen: "clientConversation", selectedAppointmentId: "a1", visibilityState: "visible" };

describe("endereço da conversa", () => {
  it("o caminho é o da rota registrada", () => {
    expect(OPEN_CONVERSATION_PATH).toBe(pathFor("openConversation"));
  });
  it("ida e volta do id", () => {
    const [, search] = conversationLink("a 1/2").split("?");
    expect(appointmentIdFrom(`?${search}`)).toBe("a 1/2");
  });
  it("sem o parâmetro, devolve null", () => {
    expect(appointmentIdFrom("")).toBeNull();
    expect(appointmentIdFrom("?agendamento=")).toBeNull();
  });
});

describe("conversationScreenFor", () => {
  it("cada conta tem a sua tela", () => {
    expect(conversationScreenFor("CLIENTE")).toBe("clientConversation");
    expect(conversationScreenFor("EMPRESA")).toBe("proConversation");
  });
  it("sem sessão, não há tela", () => {
    expect(conversationScreenFor(undefined)).toBeNull();
  });
});

describe("isConversationOnScreen", () => {
  it("mesma conversa aberta e visível", () => {
    expect(isConversationOnScreen(onScreen, "a1")).toBe(true);
    expect(isConversationOnScreen({ ...onScreen, screen: "proConversation" }, "a1")).toBe(true);
  });
  it("outra conversa", () => {
    expect(isConversationOnScreen(onScreen, "a2")).toBe(false);
  });
  it("aba escondida", () => {
    expect(isConversationOnScreen({ ...onScreen, visibilityState: "hidden" }, "a1")).toBe(false);
  });
  it("outra tela, mesmo com o agendamento selecionado", () => {
    expect(isConversationOnScreen({ ...onScreen, screen: "clientAgendaDetail" }, "a1")).toBe(false);
  });
  it("nada selecionado", () => {
    expect(isConversationOnScreen({ ...onScreen, selectedAppointmentId: null }, "a1")).toBe(false);
  });
});
