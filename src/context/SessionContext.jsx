// Sessão: tela atual (vem da URL), login no backend, tipo de conta e atalhos de navegação · API: kira-backend (auth, notificações)
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { bottomNavItems } from "../client/data/options";
import { proBottomNavItems } from "../professional/data/navigation";
import { keyFor, pathFor } from "../routes";
import { api, authStore } from "../shared/api";

const SessionContext = createContext(null);

const clientTabs = bottomNavItems.map((i) => i.key);
const proTabs = proBottomNavItems.map((i) => i.key);
const accountTypeOf = (auth) => ({ CLIENTE: "client", EMPRESA: "professional" })[auth?.tipo] ?? null;

export function SessionProvider({ children }) {
  // A tela atual vem da URL; setScreen(chave) navega para a rota da tela (botão voltar do navegador funciona).
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const screen = keyFor(pathname) ?? "splash";
  const setScreen = useCallback((key) => navigate(pathFor(key)), [navigate]);
  // auth = { token, refreshToken, tipo, nome, email, id } salvo pelo cliente HTTP
  const [auth, setAuth] = useState(() => authStore.get());
  const [chosenAccountType, setAccountType] = useState(null);
  const lastAuth = useRef(auth);
  const loggingOut = useRef(false);

  // Sessão perdida sem a pessoa sair (refresh recusado ou saída em outra aba): limpa os dados e volta ao
  // login. Outra conta entrando em outra aba também limpa, para não mostrar os dados da anterior.
  useEffect(
    () =>
      authStore.subscribe((next) => {
        const previous = lastAuth.current;
        lastAuth.current = next;
        setAuth(next);
        if (!previous) return;
        const lost = !next && !loggingOut.current;
        if (lost || (next && next.id !== previous.id)) queryClient.clear();
        if (lost) {
          api.notifications.forget();
          setAccountType(null);
          navigate(pathFor("login"), { replace: true });
        }
      }),
    [navigate, queryClient],
  );

  const login = useCallback(
    async (credentials) => {
      const session = await api.auth.login(credentials);
      queryClient.clear();
      setAccountType(accountTypeOf(session));
      return session;
    },
    [queryClient],
  );
  const logout = useCallback(async () => {
    loggingOut.current = true;
    try {
      await api.auth.logout();
    } finally {
      loggingOut.current = false;
    }
    queryClient.clear();
    setAccountType(null);
    navigate(pathFor("splash"));
  }, [navigate, queryClient]);

  const accountType = accountTypeOf(auth) ?? chosenAccountType;

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      auth,
      login,
      logout,
      accountType,
      setAccountType,
      goToTab: (key) => clientTabs.includes(key) && setScreen(key),
      goToProTab: (key) => proTabs.includes(key) && setScreen(key),
      // A verificação facial lê para onde voltar e continuar do estado da navegação.
      goToFace: (backTo, returnTo) => navigate(pathFor("face"), { state: { backTo, returnTo } }),
    }),
    [screen, setScreen, auth, login, logout, accountType, navigate],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession precisa estar dentro de <SessionProvider>");
  return ctx;
};
