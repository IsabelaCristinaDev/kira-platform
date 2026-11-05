// Provador virtual e ranking: fotos da cliente e profissionais recomendadas · API: kira-backend (lista de estúdios)
import { createContext, useContext, useState } from "react";
import { recommendProfessionals } from "../client/recommendation";
import { useProfessionals } from "../client/hooks/useProfessionals";
import { useSession } from "./SessionContext";
import { useSignup } from "./SignupContext";

const TryOnContext = createContext(null);

export function TryOnProvider({ children }) {
  const { setScreen } = useSession();
  const [tryOnReference, setTryOnReference] = useState("");
  const [tryOnClientPhoto, setTryOnClientPhoto] = useState("");
  const [rankingSource, setRankingSource] = useState("direct"); // "direct" | "provador"

  const startTryOnFlow = () => {
    setTryOnReference("");
    setTryOnClientPhoto("");
    setScreen("clientTryOnReference");
  };
  const goToPersonalizedRanking = () => {
    setRankingSource("provador");
    setScreen("clientHome");
  };

  const value = {
    tryOnReference,
    setTryOnReference,
    tryOnClientPhoto,
    setTryOnClientPhoto,
    rankingSource,
    startTryOnFlow,
    goToPersonalizedRanking,
  };
  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
}

export const useTryOn = () => {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error("useTryOn precisa estar dentro de <TryOnProvider>");
  return ctx;
};

// Ranking: personalizado (referência do Provador) na tela de resultado e depois de "Encontrar
// profissionais"; geral quando acessado direto. A lista vem do backend e a ordem é calculada aqui.
export function useRanking() {
  const { screen } = useSession();
  const { cPreferences } = useSignup();
  const { rankingSource, tryOnReference, tryOnClientPhoto } = useTryOn();
  const personalized = rankingSource === "provador" || screen === "clientTryOnResult";
  const query = useProfessionals();
  const recommended = query.data
    ? recommendProfessionals(query.data, {
        service: cPreferences[0] || null,
        category: personalized ? null : "todos",
        referenceImage: personalized ? tryOnReference : null,
        generatedImage: personalized ? tryOnClientPhoto : null,
        preferences: cPreferences,
        limit: personalized ? 5 : 10,
      })
    : [];
  return {
    recommended,
    rankingLoading: query.isFetching,
    rankingError: query.isError && !query.isFetching,
    loadRanking: query.refetch,
  };
}
