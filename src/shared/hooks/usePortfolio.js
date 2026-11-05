// Fotos do portfólio de um estúdio (lista pública) e envio/remoção pelo dono · api.portfolio
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export const usePortfolio = (proId) =>
  useQuery({ queryKey: ["portfolio", proId], queryFn: () => api.portfolio.list(proId), enabled: !!proId });

// Envia uma foto por vez: o backend recebe um arquivo por chamada
export const useAddPortfolioPhoto = (proId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.portfolio.add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["portfolio", proId] }),
  });
};

export const useRemovePortfolioPhoto = (proId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.portfolio.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["portfolio", proId] }),
  });
};
