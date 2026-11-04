// Testes do registro do navegador: resultados da permissão, servidor desligado e saída da conta · navegador e chamadas simulados
import { afterEach, describe, expect, it, vi } from "vitest";
import { PUSH_STATUS } from "../api/contract";
import {
  base64UrlToBytes,
  disableWebPush,
  enableWebPush,
  forgetWebPush,
  REMOVE_TIMEOUT_MS,
  syncWebPush,
  toDeviceRequest,
} from "./webPush";

const KEY = "AQIDBA"; // bytes 1, 2, 3, 4

const makeSubscription = (key = base64UrlToBytes(KEY)) => ({
  endpoint: "https://fcm.googleapis.com/fcm/send/x",
  options: { applicationServerKey: key.buffer },
  toJSON: () => ({ endpoint: "https://fcm.googleapis.com/fcm/send/x", keys: { p256dh: "chave", auth: "segredo" } }),
  unsubscribe: vi.fn().mockResolvedValue(true),
});

const makeBrowser = ({ permission = "granted", existing = null } = {}) => {
  const created = makeSubscription();
  const registration = {
    pushManager: {
      getSubscription: vi.fn().mockResolvedValue(existing),
      subscribe: vi.fn().mockResolvedValue(created),
    },
  };
  const serviceWorker = {
    register: vi.fn().mockResolvedValue(registration),
    getRegistration: vi.fn().mockResolvedValue(registration),
    ready: Promise.resolve(registration),
  };
  vi.stubGlobal("navigator", { serviceWorker });
  vi.stubGlobal("PushManager", class {});
  vi.stubGlobal("Notification", { permission, requestPermission: vi.fn().mockResolvedValue(permission) });
  return { registration, serviceWorker, created };
};

const makeCalls = (publicKey = KEY) => ({
  getPublicKey: vi.fn().mockResolvedValue(publicKey),
  registerDevice: vi.fn().mockResolvedValue(null),
  removeDevice: vi.fn().mockResolvedValue(null),
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("conversões", () => {
  it("base64url com e sem caracteres trocados", () => {
    expect([...base64UrlToBytes(KEY)]).toEqual([1, 2, 3, 4]);
    expect([...base64UrlToBytes("-_8")]).toEqual([251, 255]);
  });
  it("monta o corpo que o backend espera", () => {
    expect(toDeviceRequest(makeSubscription())).toEqual({
      endpoint: "https://fcm.googleapis.com/fcm/send/x",
      p256dh: "chave",
      auth: "segredo",
    });
  });
});

describe("enableWebPush", () => {
  it("permitido: inscreve com a chave do backend e registra o navegador", async () => {
    const { registration, serviceWorker } = makeBrowser();
    const calls = makeCalls();
    await expect(enableWebPush(calls)).resolves.toBe(PUSH_STATUS.GRANTED);
    expect(serviceWorker.register).toHaveBeenCalledWith("/sw.js");
    const options = registration.pushManager.subscribe.mock.calls[0][0];
    expect(options.userVisibleOnly).toBe(true);
    expect([...options.applicationServerKey]).toEqual([1, 2, 3, 4]);
    expect(calls.registerDevice).toHaveBeenCalledWith({
      endpoint: "https://fcm.googleapis.com/fcm/send/x",
      p256dh: "chave",
      auth: "segredo",
    });
  });
  it("sem suporte: não pede a permissão", async () => {
    vi.stubGlobal("navigator", {});
    const calls = makeCalls();
    await expect(enableWebPush(calls)).resolves.toBe(PUSH_STATUS.UNSUPPORTED);
    expect(calls.getPublicKey).not.toHaveBeenCalled();
  });
  it("bloqueado: não chama o backend", async () => {
    makeBrowser({ permission: "denied" });
    const calls = makeCalls();
    await expect(enableWebPush(calls)).resolves.toBe(PUSH_STATUS.BLOCKED);
    expect(calls.getPublicKey).not.toHaveBeenCalled();
  });
  it("fechou o pedido sem escolher", async () => {
    makeBrowser({ permission: "default" });
    await expect(enableWebPush(makeCalls())).resolves.toBe(PUSH_STATUS.DISMISSED);
  });
  it("sem as chaves no servidor: desligado, sem erro e sem inscrever", async () => {
    const { registration, serviceWorker } = makeBrowser();
    const calls = makeCalls(null);
    await expect(enableWebPush(calls)).resolves.toBe(PUSH_STATUS.SERVER_OFF);
    expect(serviceWorker.register).not.toHaveBeenCalled();
    expect(registration.pushManager.subscribe).not.toHaveBeenCalled();
  });
  it("falha em qualquer etapa vira resultado, não rejeição", async () => {
    makeBrowser();
    const calls = makeCalls();
    calls.registerDevice.mockRejectedValue(new Error("fora do ar"));
    await expect(enableWebPush(calls)).resolves.toBe(PUSH_STATUS.FAILED);
  });
  it("registros ao mesmo tempo acontecem um depois do outro", async () => {
    makeBrowser();
    let tail = Promise.resolve();
    navigator.locks = {
      request: (_name, task) => {
        const run = tail.then(task);
        tail = run.catch(() => {});
        return run;
      },
    };
    let running = 0;
    let most = 0;
    const calls = makeCalls();
    calls.registerDevice.mockImplementation(async () => {
      most = Math.max(most, ++running);
      await new Promise((resolve) => setTimeout(resolve));
      running--;
    });
    await Promise.all([enableWebPush(calls), syncWebPush(calls)]);
    expect(calls.registerDevice).toHaveBeenCalledTimes(2);
    expect(most).toBe(1);
  });
  it("aproveita a inscrição feita com a mesma chave", async () => {
    const existing = makeSubscription();
    const { registration } = makeBrowser({ existing });
    await enableWebPush(makeCalls());
    expect(registration.pushManager.subscribe).not.toHaveBeenCalled();
    expect(existing.unsubscribe).not.toHaveBeenCalled();
  });
  it("troca a inscrição feita com outra chave", async () => {
    const existing = makeSubscription(new Uint8Array([9, 9, 9, 9]));
    const { registration } = makeBrowser({ existing });
    await enableWebPush(makeCalls());
    expect(existing.unsubscribe).toHaveBeenCalled();
    expect(registration.pushManager.subscribe).toHaveBeenCalled();
  });
});

describe("syncWebPush", () => {
  it("com a permissão dada, registra sem pedir de novo", async () => {
    makeBrowser();
    const calls = makeCalls();
    await syncWebPush(calls);
    expect(Notification.requestPermission).not.toHaveBeenCalled();
    expect(calls.registerDevice).toHaveBeenCalled();
  });
  it("sem a permissão, não faz nada", async () => {
    const { serviceWorker } = makeBrowser({ permission: "default" });
    const calls = makeCalls();
    await syncWebPush(calls);
    expect(calls.getPublicKey).not.toHaveBeenCalled();
    expect(serviceWorker.register).not.toHaveBeenCalled();
  });
  it("falha não rejeita", async () => {
    makeBrowser();
    const calls = makeCalls();
    calls.getPublicKey.mockRejectedValue(new Error("fora do ar"));
    await expect(syncWebPush(calls)).resolves.toBeUndefined();
  });
});

describe("disableWebPush", () => {
  it("remove do backend e cancela a inscrição", async () => {
    const existing = makeSubscription();
    makeBrowser({ existing });
    const calls = makeCalls();
    await disableWebPush(calls);
    expect(calls.removeDevice).toHaveBeenCalledWith(existing.endpoint);
    expect(existing.unsubscribe).toHaveBeenCalled();
  });
  it("sem inscrição, não chama o backend", async () => {
    makeBrowser();
    const calls = makeCalls();
    await disableWebPush(calls);
    expect(calls.removeDevice).not.toHaveBeenCalled();
  });
  it("sem suporte, termina sem erro", async () => {
    vi.stubGlobal("navigator", {});
    await expect(disableWebPush(makeCalls())).resolves.toBeUndefined();
  });
  it("backend recusando: não rejeita e cancela a inscrição mesmo assim", async () => {
    const existing = makeSubscription();
    makeBrowser({ existing });
    const calls = makeCalls();
    calls.removeDevice.mockRejectedValue(new Error("fora do ar"));
    await expect(disableWebPush(calls)).resolves.toBeUndefined();
    expect(existing.unsubscribe).toHaveBeenCalled();
  });
  it("backend sem responder: termina no tempo limite", async () => {
    vi.useFakeTimers();
    const existing = makeSubscription();
    makeBrowser({ existing });
    const calls = makeCalls();
    calls.removeDevice.mockReturnValue(new Promise(() => {}));
    let finished = false;
    disableWebPush(calls).then(() => {
      finished = true;
    });
    await vi.advanceTimersByTimeAsync(REMOVE_TIMEOUT_MS - 1);
    expect(finished).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(finished).toBe(true);
  });
});

describe("forgetWebPush", () => {
  it("cancela a inscrição", async () => {
    const existing = makeSubscription();
    makeBrowser({ existing });
    await forgetWebPush();
    expect(existing.unsubscribe).toHaveBeenCalled();
  });
  it("falha não rejeita", async () => {
    const existing = makeSubscription();
    existing.unsubscribe.mockRejectedValue(new Error("x"));
    makeBrowser({ existing });
    await expect(forgetWebPush()).resolves.toBeUndefined();
  });
});
