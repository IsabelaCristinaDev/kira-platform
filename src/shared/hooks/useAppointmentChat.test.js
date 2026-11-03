// Testes da conversa do agendamento: mensagem ao vivo durante uma busca da lista · API: simulada
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { addMessageToChat } from "./useAppointmentChat";

const message = (id, minute) => ({ id, createdAt: `2026-11-03T10:0${minute}:00` });
const queryKey = ["messages", "a1"];

// Consulta ativa cujas buscas só terminam quando o teste manda
const setup = () => {
  const queryClient = new QueryClient();
  const pending = [];
  const queryFn = vi.fn(() => new Promise((resolve) => pending.push(resolve)));
  const observer = new QueryObserver(queryClient, { queryKey, queryFn, retry: false });
  const stop = observer.subscribe(() => {});
  const settle = () => vi.waitFor(() => expect(queryClient.isFetching({ queryKey })).toBe(0));
  return { queryClient, pending, queryFn, stop, settle };
};

describe("addMessageToChat", () => {
  it("mensagem recebida durante uma atualização da lista não se perde", async () => {
    const { queryClient, pending, queryFn, stop, settle } = setup();
    pending[0]([message("m1", 1)]);
    await settle();

    queryClient.invalidateQueries({ queryKey });
    await vi.waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));

    addMessageToChat(queryClient, "a1", message("m2", 2));
    await vi.waitFor(() => expect(queryFn).toHaveBeenCalledTimes(3));

    // A busca antiga, sem a mensagem nova, termina depois e é ignorada
    pending[1]([message("m1", 1)]);
    pending[2]([message("m1", 1), message("m2", 2)]);
    await settle();

    expect(queryClient.getQueryData(queryKey).map((m) => m.id)).toEqual(["m1", "m2"]);
    stop();
  });

  it("mensagem recebida antes da primeira carga entra na lista", async () => {
    const { queryClient, pending, queryFn, stop, settle } = setup();
    addMessageToChat(queryClient, "a1", message("m1", 1));
    await vi.waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));

    pending[0]([]);
    pending[1]([message("m1", 1)]);
    await settle();

    expect(queryClient.getQueryData(queryKey).map((m) => m.id)).toEqual(["m1"]);
    stop();
  });

  it("sem busca em andamento, só junta a mensagem", async () => {
    const { queryClient, pending, queryFn, stop, settle } = setup();
    pending[0]([message("m1", 1)]);
    await settle();

    addMessageToChat(queryClient, "a1", message("m2", 2));

    expect(queryFn).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(queryKey).map((m) => m.id)).toEqual(["m1", "m2"]);
    stop();
  });
});
