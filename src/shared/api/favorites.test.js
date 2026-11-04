// Testes de api.favorites e api.emergencyContacts: rotas e formatos do backend e mock do Expo · fetch simulado
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authStore } from "./http";
import { httpAdapter as api } from "./httpAdapter";
import { mockAdapter } from "./mockAdapter";

const pathOf = (call) => new URL(String(call[0])).pathname;
const methodOf = (call) => call[1].method ?? "GET";
const bodyOf = (call) => JSON.parse(call[1].body);
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  });
  vi.stubGlobal("location", { origin: "http://localhost" });
  authStore.set({ token: "t", refreshToken: "r", tipo: "CLIENTE", id: "u1" });
});
afterEach(() => vi.unstubAllGlobals());

const stubFetch = (respond = () => new Response(null, { status: 204 })) => {
  const fetch = vi.fn(async (...args) => respond(...args));
  vi.stubGlobal("fetch", fetch);
  return fetch;
};

describe("api.favorites", () => {
  it("lista só os ids dos estúdios", async () => {
    const fetch = stubFetch(() =>
      json([
        { id: "e1", nome: "Um" },
        { id: "e2", nome: "Dois" },
      ]),
    );
    await expect(api.favorites.listIds()).resolves.toEqual(["e1", "e2"]);
    expect(pathOf(fetch.mock.calls[0])).toBe("/api/favoritas");
  });
  it("salva com PUT e remove com DELETE, com o id na rota", async () => {
    const fetch = stubFetch();
    await api.favorites.add("e1");
    await api.favorites.remove("e1");
    expect(fetch.mock.calls.map((c) => [methodOf(c), pathOf(c)])).toEqual([
      ["PUT", "/api/favoritas/e1"],
      ["DELETE", "/api/favoritas/e1"],
    ]);
  });
});

describe("api.emergencyContacts", () => {
  const backend = { id: "c1", nome: "Rosa", telefone: "62988887777", parentesco: "Mãe" };
  const contact = { id: "c1", name: "Rosa", phone: "62988887777", relationship: "Mãe" };

  it("lista no formato das telas", async () => {
    stubFetch(() => json([backend, { ...backend, parentesco: null }]));
    await expect(api.emergencyContacts.list()).resolves.toEqual([contact, { ...contact, relationship: null }]);
  });
  it("cadastra sem espaços sobrando, e parentesco vazio vai nulo", async () => {
    const fetch = stubFetch(() => json(backend, 201));
    await expect(
      api.emergencyContacts.create({ name: " Rosa ", phone: " 62988887777 ", relationship: " " }),
    ).resolves.toEqual(contact);
    expect(methodOf(fetch.mock.calls[0])).toBe("POST");
    expect(pathOf(fetch.mock.calls[0])).toBe("/api/contatos-emergencia");
    expect(bodyOf(fetch.mock.calls[0])).toEqual({ nome: "Rosa", telefone: "62988887777", parentesco: null });
  });
  it("remove com o id na rota", async () => {
    const fetch = stubFetch();
    await api.emergencyContacts.remove("c1");
    expect([methodOf(fetch.mock.calls[0]), pathOf(fetch.mock.calls[0])]).toEqual([
      "DELETE",
      "/api/contatos-emergencia/c1",
    ]);
  });
});

describe("mock do Expo", () => {
  it("favoritas e contatos funcionam na memória, com o mesmo limite", async () => {
    await mockAdapter.favorites.add("e1");
    await expect(mockAdapter.favorites.listIds()).resolves.toEqual(["e1"]);
    await mockAdapter.favorites.remove("e1");
    await expect(mockAdapter.favorites.listIds()).resolves.toEqual([]);

    const first = await mockAdapter.emergencyContacts.create({ name: "Rosa", phone: "1" });
    await Promise.all([2, 3, 4, 5].map((n) => mockAdapter.emergencyContacts.create({ name: `P${n}`, phone: "1" })));
    await expect(mockAdapter.emergencyContacts.create({ name: "Sexta", phone: "1" })).rejects.toThrow("no máximo 5");
    await mockAdapter.emergencyContacts.remove(first.id);
    expect(await mockAdapter.emergencyContacts.list()).toHaveLength(4);
  });
});
