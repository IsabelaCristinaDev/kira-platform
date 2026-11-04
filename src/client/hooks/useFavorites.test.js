// Testes das favoritas: resposta imediata, ordem dos toques e falha no backend · API: simulada
import { MutationObserver, QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { favoriteToggleOptions } from "./useFavorites";

const queryKey = ["favorites", "u1"];

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const setup = (initial = []) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKey, initial);
  const pending = [];
  const call = vi.fn(() => {
    const step = deferred();
    pending.push(step);
    return step.promise;
  });
  const calls = { add: vi.fn((...args) => call("add", ...args)), remove: vi.fn((...args) => call("remove", ...args)) };
  const toggle = (variables) =>
    new MutationObserver(queryClient, favoriteToggleOptions(queryClient, "u1", calls)).mutate(variables);
  const idle = () => vi.waitFor(() => expect(queryClient.isMutating()).toBe(0));
  return { queryClient, pending, calls, toggle, idle };
};

describe("favoriteToggleOptions", () => {
  it("salva e mostra antes da resposta do backend", async () => {
    const { queryClient, pending, calls, toggle, idle } = setup();
    toggle({ id: "e1", saved: false });
    await vi.waitFor(() => expect(queryClient.getQueryData(queryKey)).toEqual(["e1"]));
    await vi.waitFor(() => expect(calls.add).toHaveBeenCalledWith("e1"));
    pending[0].resolve();
    await idle();
  });

  it("remove", async () => {
    const { queryClient, pending, calls, toggle, idle } = setup(["e1", "e2"]);
    toggle({ id: "e1", saved: true });
    await vi.waitFor(() => expect(calls.remove).toHaveBeenCalledWith("e1"));
    expect(queryClient.getQueryData(queryKey)).toEqual(["e2"]);
    pending[0].resolve();
    await idle();
  });

  it("se o backend falhar, volta como estava", async () => {
    const { queryClient, pending, calls, toggle, idle } = setup(["e2"]);
    toggle({ id: "e1", saved: false }).catch(() => {});
    await vi.waitFor(() => expect(calls.add).toHaveBeenCalled());
    pending[0].reject(new Error("fora do ar"));
    await idle();
    expect(queryClient.getQueryData(queryKey)).toEqual(["e2"]);
  });

  it("toques seguidos vão ao backend na ordem, um de cada vez", async () => {
    const { pending, calls, toggle, idle, queryClient } = setup();
    toggle({ id: "e1", saved: false });
    toggle({ id: "e1", saved: true });
    await vi.waitFor(() => expect(calls.add).toHaveBeenCalledTimes(1));
    expect(calls.remove).not.toHaveBeenCalled();
    pending[0].resolve();
    await vi.waitFor(() => expect(calls.remove).toHaveBeenCalledTimes(1));
    pending[1].resolve();
    await idle();
    expect(queryClient.getQueryData(queryKey)).toEqual([]);
  });

  it("uma consulta antiga não desfaz o toque", async () => {
    const { queryClient, pending, calls, toggle, idle } = setup();
    const old = deferred();
    queryClient.fetchQuery({ queryKey, queryFn: () => old.promise }).catch(() => {});
    toggle({ id: "e1", saved: false });
    await vi.waitFor(() => expect(calls.add).toHaveBeenCalled());
    old.resolve([]);
    expect(queryClient.getQueryData(queryKey)).toEqual(["e1"]);
    pending[0].resolve();
    await idle();
  });
});
