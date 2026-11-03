// Testes do cliente HTTP: token Bearer, renovação no 401 e erros do backend · fetch simulado
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, errorMessage, SESSION_ENDED } from "./contract";
import { authStore, request } from "./http";

const json = (status, body) => new Response(body === undefined ? null : JSON.stringify(body), { status });

beforeEach(() => {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("request", () => {
  it("envia o token salvo e devolve o JSON", async () => {
    authStore.set({ token: "t1", refreshToken: "r1", id: "u1" });
    const fetch = vi.fn().mockResolvedValue(json(200, [{ id: 1 }]));
    vi.stubGlobal("fetch", fetch);
    expect(await request("/api/studios", { query: { cidade: "Goiânia", vazio: null } })).toEqual([{ id: 1 }]);
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/studios\?cidade=Goi%C3%A2nia$/);
    expect(init.headers.Authorization).toBe("Bearer t1");
  });

  it("no 401 renova o token uma vez e repete a chamada", async () => {
    authStore.set({ token: "velho", refreshToken: "r1", id: "u1" });
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(json(401))
      .mockResolvedValueOnce(json(200, { token: "novo", refreshToken: "r2", tipo: "CLIENTE" }))
      .mockResolvedValueOnce(json(200, { ok: true }));
    vi.stubGlobal("fetch", fetch);
    expect(await request("/api/agendamentos/cliente/u1")).toEqual({ ok: true });
    expect(fetch.mock.calls[2][1].headers.Authorization).toBe("Bearer novo");
    expect(authStore.get()).toMatchObject({ token: "novo", refreshToken: "r2", id: "u1" });
  });

  it("refresh recusado encerra a sessão", async () => {
    authStore.set({ token: "velho", refreshToken: "r1" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(json(401)).mockResolvedValueOnce(json(400)));
    const error = await request("/api/x").catch((e) => e);
    expect(error).toMatchObject({ code: SESSION_ENDED, status: 401 });
    expect(errorMessage(error)).toBe("Sua sessão terminou. Entre de novo para continuar.");
    expect(authStore.get()).toBeNull();
  });

  it("erro temporário na renovação mantém a sessão", async () => {
    const session = { token: "velho", refreshToken: "r1", id: "u1" };
    authStore.set(session);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(json(401)).mockResolvedValueOnce(json(503)));
    await expect(request("/api/x")).rejects.toMatchObject({ code: "sem_conexao" });
    expect(authStore.get()).toEqual(session);
  });

  it("falha de rede na renovação mantém a sessão", async () => {
    const session = { token: "velho", refreshToken: "r1", id: "u1" };
    authStore.set(session);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(json(401)).mockRejectedValueOnce(new TypeError("Failed to fetch")),
    );
    await expect(request("/api/x")).rejects.toMatchObject({ code: "sem_conexao" });
    expect(authStore.get()).toEqual(session);
  });

  it("se outra aba já renovou, repete a chamada sem renovar de novo", async () => {
    authStore.set({ token: "velho", refreshToken: "r1", id: "u1" });
    const fetch = vi
      .fn()
      .mockImplementationOnce(async () => {
        authStore.set({ token: "novo", refreshToken: "r2", id: "u1" });
        return json(401);
      })
      .mockResolvedValueOnce(json(200, { ok: true }));
    vi.stubGlobal("fetch", fetch);
    expect(await request("/api/x")).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe("Bearer novo");
  });

  it("refresh recusado porque outra aba renovou no mesmo instante não encerra a sessão", async () => {
    authStore.set({ token: "velho", refreshToken: "r1", id: "u1" });
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(json(401))
      .mockImplementationOnce(async () => {
        authStore.set({ token: "novo", refreshToken: "r2", id: "u1" });
        return json(400);
      })
      .mockResolvedValueOnce(json(200, { ok: true }));
    vi.stubGlobal("fetch", fetch);
    expect(await request("/api/x")).toEqual({ ok: true });
    expect(authStore.get()).toMatchObject({ token: "novo", refreshToken: "r2" });
  });

  it("sair da conta durante a renovação não traz a sessão de volta", async () => {
    authStore.set({ token: "velho", refreshToken: "r1", id: "u1" });
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(json(401))
        .mockImplementationOnce(async () => {
          authStore.set(null);
          return json(200, { token: "novo", refreshToken: "r2" });
        }),
    );
    await expect(request("/api/x")).rejects.toMatchObject({ code: SESSION_ENDED });
    expect(authStore.get()).toBeNull();
  });

  it("senha errada no login continua com a mensagem de credenciais", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(401, { erro: "CREDENCIAIS_INVALIDAS" })));
    const error = await request("/api/auth/login", { method: "POST", auth: false }).catch((e) => e);
    expect(errorMessage(error)).toBe("E-mail ou senha incorretos.");
  });

  it("converte o ErroResponse do backend em ApiError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(json(400, { status: 400, erro: "REGRA_DE_NEGOCIO", mensagem: "Horário ocupado" })),
    );
    const error = await request("/api/x", { auth: false }).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect([error.code, error.message, error.status]).toEqual(["REGRA_DE_NEGOCIO", "Horário ocupado", 400]);
  });

  it("falha de rede vira ApiError sem_conexao", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(request("/api/x", { auth: false })).rejects.toMatchObject({ code: "sem_conexao", status: 0 });
  });
});

describe("authStore", () => {
  it("avisa quando a sessão muda em outra aba", async () => {
    const handlers = {};
    vi.stubGlobal("addEventListener", (type, fn) => (handlers[type] = fn));
    vi.resetModules();
    const { authStore: store } = await import("./http");
    const onChange = vi.fn();
    store.subscribe(onChange);

    handlers.storage({ key: "outra.chave" });
    expect(onChange).not.toHaveBeenCalled();

    handlers.storage({ key: "kira.auth" });
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
