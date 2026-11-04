// Testes de api.notifications: rotas e formatos do backend, saída da conta e mock do Expo · fetch e navegador simulados
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PUSH_STATUS } from "./contract";
import { authStore } from "./http";
import { httpAdapter as api } from "./httpAdapter";
import { mockAdapter } from "./mockAdapter";

const DEVICES = "/api/notificacoes/dispositivos/web";
const ENDPOINT = "https://fcm.googleapis.com/fcm/send/x";
const bodyOf = (call) => JSON.parse(call[1].body);
const pathOf = (call) => new URL(String(call[0])).pathname;

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

const stubSubscribedBrowser = () => {
  const subscription = { endpoint: ENDPOINT, unsubscribe: vi.fn().mockResolvedValue(true) };
  const registration = { pushManager: { getSubscription: vi.fn().mockResolvedValue(subscription) } };
  vi.stubGlobal("navigator", { serviceWorker: { getRegistration: vi.fn().mockResolvedValue(registration) } });
  vi.stubGlobal("PushManager", class {});
  vi.stubGlobal("Notification", { permission: "granted" });
  return subscription;
};

describe("chamadas", () => {
  it("lê a chave pública, nula com as notificações desligadas", async () => {
    const fetch = stubFetch(() => new Response(JSON.stringify({ chavePublica: null }), { status: 200 }));
    await expect(api.notifications.getPublicKey()).resolves.toBeNull();
    expect(pathOf(fetch.mock.calls[0])).toBe("/api/notificacoes/chave-publica");
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer t");
  });
  it("registra com endpoint, p256dh e auth", async () => {
    const fetch = stubFetch();
    const device = { endpoint: ENDPOINT, p256dh: "k", auth: "s" };
    await api.notifications.registerDevice(device);
    expect(pathOf(fetch.mock.calls[0])).toBe(DEVICES);
    expect(fetch.mock.calls[0][1].method).toBe("POST");
    expect(bodyOf(fetch.mock.calls[0])).toEqual(device);
  });
  it("remove pelo endpoint", async () => {
    const fetch = stubFetch();
    await api.notifications.removeDevice(ENDPOINT);
    expect(fetch.mock.calls[0][1].method).toBe("DELETE");
    expect(bodyOf(fetch.mock.calls[0])).toEqual({ endpoint: ENDPOINT });
  });
});

describe("auth.logout", () => {
  it("remove o navegador com o token, antes de a sessão acabar", async () => {
    const subscription = stubSubscribedBrowser();
    const sessionAtRemoval = [];
    const fetch = stubFetch((url) => {
      if (String(url).endsWith(DEVICES)) sessionAtRemoval.push(authStore.get());
      return new Response(null, { status: 204 });
    });
    await api.auth.logout();
    expect(fetch.mock.calls.map(pathOf)).toEqual([DEVICES, "/api/auth/logout"]);
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer t");
    expect(sessionAtRemoval[0]).toMatchObject({ token: "t" });
    expect(subscription.unsubscribe).toHaveBeenCalled();
    expect(authStore.get()).toBeNull();
  });
  it("a falha na remoção não impede a saída", async () => {
    stubSubscribedBrowser();
    const fetch = stubFetch((url) => {
      if (String(url).endsWith(DEVICES)) throw new TypeError("sem rede");
      return new Response(null, { status: 204 });
    });
    await expect(api.auth.logout()).resolves.toBeUndefined();
    expect(authStore.get()).toBeNull();
    expect(fetch.mock.calls.map(pathOf)).toContain("/api/auth/logout");
  });
  it("sem suporte no navegador, só sai", async () => {
    vi.stubGlobal("navigator", {});
    const fetch = stubFetch();
    await api.auth.logout();
    expect(fetch.mock.calls.map(pathOf)).toEqual(["/api/auth/logout"]);
  });
});

describe("mock do Expo", () => {
  it("tem as mesmas funções do adaptador HTTP", () => {
    expect(Object.keys(mockAdapter.notifications).sort()).toEqual(Object.keys(api.notifications).sort());
  });
  it("não tem service worker: sem suporte", async () => {
    await expect(mockAdapter.notifications.enable()).resolves.toBe(PUSH_STATUS.UNSUPPORTED);
  });
});
