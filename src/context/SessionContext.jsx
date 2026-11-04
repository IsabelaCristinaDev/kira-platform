// Sessão: tela atual (vem da URL), tipo de conta e atalhos de navegação · API: nenhuma
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bottomNavItems } from "../client/data/mocks";
import { proBottomNavItems } from "../professional/data/mocks";
import { keyFor, pathFor } from "../routes";

const SessionContext = createContext(null);

const clientTabs = bottomNavItems.map((i) => i.key);
const proTabs = proBottomNavItems.map((i) => i.key);

export function SessionProvider({ children }) {
  // A tela atual vem da URL; setScreen(chave) navega para a rota da tela (botão voltar do navegador funciona).
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screen = keyFor(pathname) ?? "splash";
  const setScreen = useCallback((key) => navigate(pathFor(key)), [navigate]);
  const [accountType, setAccountType] = useState(null);

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      accountType,
      setAccountType,
      goToTab: (key) => clientTabs.includes(key) && setScreen(key),
      goToProTab: (key) => proTabs.includes(key) && setScreen(key),
      // A verificação facial lê para onde voltar e continuar do estado da navegação.
      // abre a tela guardando de onde veio, para o botão voltar dela retornar ao lugar certo
      openWithBack: (key, backTo) => navigate(pathFor(key), { state: { backTo } }),
      goToFace: (backTo, returnTo) => navigate(pathFor("face"), { state: { backTo, returnTo } }),
    }),
    [screen, setScreen, accountType, navigate],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession precisa estar dentro de <SessionProvider>");
  return ctx;
};
