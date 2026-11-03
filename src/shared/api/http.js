// Cliente HTTP do kira-backend: URL base, token Bearer, renovação do token e erros · API: kira-backend (VITE_API_URL)
import { ApiError, SESSION_ENDED, SESSION_ENDED_MESSAGE } from "./contract";

// Em desenvolvimento fica vazio: as chamadas vão para /api na origem do app e o proxy do Vite
// repassa ao backend (vite.config.js). No build, VITE_API_URL aponta para o backend.
export const API_URL = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "" : "http://localhost:8081")).replace(
  /\/$/,
  "",
);
const baseUrl = () => API_URL || globalThis.location?.origin || "http://localhost";

// Mesmo endereço da API, trocando http por ws (e https por wss)
export const webSocketUrl = () => `${baseUrl().replace(/^http/, "ws")}/ws`;

const STORAGE_KEY = "kira.auth";

// Sessão salva no navegador: { token, refreshToken, tipo, nome, email, id }
export const authStore = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
    } catch {
      return null;
    }
  },
  set(auth) {
    try {
      if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // sem localStorage (aba privada): a sessão vale só até recarregar
    }
    listeners.forEach((fn) => fn(auth));
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
const listeners = new Set();

// O navegador só avisa as outras abas: assim, sair ou renovar em uma aba vale para todas
globalThis.addEventListener?.("storage", (e) => {
  if (e.key === STORAGE_KEY || e.key === null) listeners.forEach((fn) => fn(authStore.get()));
});

const toApiError = async (res) => {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // corpo vazio ou não-JSON
  }
  return new ApiError(
    body?.erro ?? `http_${res.status}`,
    body?.mensagem ?? "Não foi possível falar com o servidor.",
    res.status,
    body,
  );
};

const send = (path, { method = "GET", body, query, auth = true } = {}) => {
  const url = new URL(`${baseUrl()}${path}`);
  Object.entries(query ?? {}).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? authStore.get()?.token : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
};

// Respostas em que o backend recusa o refresh token. Qualquer outro erro é temporário e mantém a sessão.
const REFRESH_REFUSED = [400, 401, 403];

// O refresh token só vale uma vez, então duas abas não podem renovar ao mesmo tempo
const oneTabAtATime = (task) =>
  globalThis.navigator?.locks ? globalThis.navigator.locks.request("kira.auth.refresh", task) : task();

// Uma renovação por vez, mesmo com várias requisições recebendo 401 juntas.
// `usedToken` é o token recusado: se a sessão já tem outro, outra aba renovou e basta repetir a chamada.
let refreshing = null;
export const refreshToken = (usedToken = authStore.get()?.token) => {
  refreshing ??= oneTabAtATime(async () => {
    const current = authStore.get();
    if (!current?.refreshToken) return false;
    if (current.token !== usedToken) return true;
    const res = await send("/api/auth/refresh", {
      method: "POST",
      body: { refreshToken: current.refreshToken },
      auth: false,
    });
    // A sessão mudou durante a chamada (saiu da conta ou outra aba renovou): vale o que está salvo
    const latest = authStore.get();
    if (latest?.refreshToken !== current.refreshToken) return !!latest;
    if (REFRESH_REFUSED.includes(res.status)) {
      authStore.set(null);
      return false;
    }
    if (!res.ok) throw new ApiError("refresh_indisponivel", "Não foi possível falar com o servidor.", res.status);
    const data = await res.json();
    authStore.set({ ...current, ...data, id: data.id ?? current.id });
    return true;
  }).finally(() => {
    refreshing = null;
  });
  return refreshing;
};

export async function request(path, options = {}) {
  let res;
  try {
    const usedToken = authStore.get()?.token;
    res = await send(path, options);
    if (res.status === 401 && options.auth !== false && (await refreshToken(usedToken))) {
      res = await send(path, options);
    }
  } catch (e) {
    throw new ApiError("sem_conexao", "Não foi possível falar com o servidor.", 0, e);
  }
  if (res.status === 401 && options.auth !== false) throw new ApiError(SESSION_ENDED, SESSION_ENDED_MESSAGE, 401);
  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
