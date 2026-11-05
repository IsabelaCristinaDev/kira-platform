// Registro do navegador para receber notificações: permissão, service worker e inscrição · dados: chamadas recebidas de api.notifications · API: Push e Notifications do navegador
import { PUSH_STATUS } from "../api/contract";

// Sair da conta não pode ficar preso esperando a remoção do navegador
export const REMOVE_TIMEOUT_MS = 3000;

const workerUrl = () => `${import.meta.env.BASE_URL}sw.js`;

const isSupported = () =>
  !!globalThis.navigator?.serviceWorker && "PushManager" in globalThis && "Notification" in globalThis;

// A chave do backend vem em base64url; o navegador pede os bytes
export const base64UrlToBytes = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

const sameBytes = (a, b) => a?.byteLength === b.byteLength && new Uint8Array(a).every((byte, i) => byte === b[i]);

// DispositivoWebRequest do backend
export const toDeviceRequest = (subscription) => {
  const { endpoint, keys } = subscription.toJSON();
  return { endpoint, p256dh: keys.p256dh, auth: keys.auth };
};

const ensureSubscription = async (registration, publicKey) => {
  const applicationServerKey = base64UrlToBytes(publicKey);
  const current = await registration.pushManager.getSubscription();
  if (current && sameBytes(current.options.applicationServerKey, applicationServerKey)) return current;
  // Inscrição feita com outra chave não pode ser reaproveitada: o navegador recusaria
  await current?.unsubscribe();
  return registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
};

// Dois registros juntos do mesmo navegador (duas abas, ou entrar e tocar no botão) dariam conflito no backend
const oneAtATime = (task) => (navigator.locks ? navigator.locks.request("kira.push.register", task) : task());

const subscribeAndRegister = (calls) =>
  oneAtATime(async () => {
    const publicKey = await calls.getPublicKey();
    // Sem as chaves no servidor, a notificação está desligada: não é um erro
    if (!publicKey) return PUSH_STATUS.SERVER_OFF;
    await navigator.serviceWorker.register(workerUrl());
    const registration = await navigator.serviceWorker.ready;
    const subscription = await ensureSubscription(registration, publicKey);
    await calls.registerDevice(toDeviceRequest(subscription));
    return PUSH_STATUS.GRANTED;
  });

const currentSubscription = async () => {
  if (!isSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return (await registration?.pushManager.getSubscription()) ?? null;
};

/**
 * Para a tela chamar no toque do botão: pede a permissão e registra o navegador. Nunca rejeita.
 * @param {{getPublicKey: Function, registerDevice: Function}} calls
 * @returns {Promise<import("../api/contract").PushStatus>}
 */
export const enableWebPush = async (calls) => {
  if (!isSupported()) return PUSH_STATUS.UNSUPPORTED;
  try {
    // Antes de qualquer chamada: alguns navegadores só mostram o pedido logo depois do toque
    const permission = await Notification.requestPermission();
    if (permission === "denied") return PUSH_STATUS.BLOCKED;
    if (permission !== "granted") return PUSH_STATUS.DISMISSED;
    return await subscribeAndRegister(calls);
  } catch {
    return PUSH_STATUS.FAILED;
  }
};

// Ao entrar na conta, sem pedir nada: quem já permitiu continua recebendo, e o navegador passa a ser da conta logada
export const syncWebPush = async (calls) => {
  if (!isSupported() || Notification.permission !== "granted") return;
  await subscribeAndRegister(calls).catch(() => {});
};

// Sair da conta: tira o navegador do backend e cancela a inscrição. Sem o backend, a inscrição cancelada
// faz o próximo envio ser recusado, e o backend apaga o registro. Nunca rejeita e tem tempo limite.
export const disableWebPush = async (calls) => {
  const removal = (async () => {
    const subscription = await currentSubscription();
    if (!subscription) return;
    await Promise.allSettled([calls.removeDevice(subscription.endpoint), subscription.unsubscribe()]);
  })();
  let timer;
  const limit = new Promise((resolve) => {
    timer = setTimeout(resolve, REMOVE_TIMEOUT_MS);
  });
  await Promise.race([removal.catch(() => {}), limit]);
  clearTimeout(timer);
};

// Sessão perdida: sem token não há como chamar o backend, então só cancela a inscrição deste navegador
export const forgetWebPush = async () => {
  try {
    await (await currentSubscription())?.unsubscribe();
  } catch {
    // o próximo login registra de novo
  }
};
