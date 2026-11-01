// Provador virtual: foto de referência, foto da cliente e consentimento · dados: mock · API: api.tryOn
import { api } from "@kira/shared/api";
import { TRYON_CONSENT_VERSION } from "@kira/shared/api/tryOnContract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TryOnContext = createContext(null);
const consentKey = ["tryon", "consent"];

export function TryOnProvider({ children }) {
  const queryClient = useQueryClient();
  const [referenceUri, setReferenceUri] = useState("");
  const [photoUri, setPhotoUri] = useState("");

  const consent = useQuery({ queryKey: consentKey, queryFn: () => api.tryOn.getConsent(), gcTime: Infinity });
  const accept = useMutation({
    mutationFn: () => api.tryOn.acceptConsent(TRYON_CONSENT_VERSION),
    onSuccess: (data) => queryClient.setQueryData(consentKey, data),
  });
  const revoke = useMutation({
    mutationFn: () => api.tryOn.revokeConsent(),
    onSuccess: (data) => {
      queryClient.setQueryData(consentKey, data);
      setPhotoUri("");
      setReferenceUri("");
    },
  });
  const deletePhotos = useMutation({
    mutationFn: () => api.tryOn.deletePhotos(),
    onSuccess: () => {
      setPhotoUri("");
      setReferenceUri("");
    },
  });

  const reset = useCallback(() => {
    setReferenceUri("");
    setPhotoUri("");
  }, []);

  const value = useMemo(
    () => ({
      referenceUri,
      setReferenceUri,
      photoUri,
      setPhotoUri,
      reset,
      consent: consent.data,
      consentLoading: consent.isPending,
      acceptConsent: accept,
      revokeConsent: revoke,
      deletePhotos,
    }),
    [referenceUri, photoUri, reset, consent.data, consent.isPending, accept, revoke, deletePhotos],
  );
  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
}

export const useTryOn = () => {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error("useTryOn precisa estar dentro de <TryOnProvider>");
  return ctx;
};
