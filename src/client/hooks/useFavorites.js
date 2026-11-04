// Favoritas da cliente: salvas na conta, com a tela respondendo na hora do toque; sem login, só na sessão · API: kira-backend (api.favorites)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";

const MUTATION_KEY = ["favorites", "toggle"];
const queryKeyFor = (userId) => ["favorites", userId];

const withFavorite = (ids = [], id, saved) => {
  const others = ids.filter((other) => other !== id);
  return saved ? [id, ...others] : others;
};

// Toques seguidos vão ao backend na ordem (`scope`), para o último valer. Se falhar, a tela volta como estava.
export const favoriteToggleOptions = (queryClient, userId, calls = api.favorites) => {
  const queryKey = queryKeyFor(userId);
  return {
    mutationKey: MUTATION_KEY,
    scope: { id: "favorites" },
    mutationFn: ({ id, saved }) => (saved ? calls.remove(id) : calls.add(id)),
    onMutate: async ({ id, saved }) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, (ids) => withFavorite(ids, id, !saved));
    },
    onError: (_error, { id, saved }) => {
      queryClient.setQueryData(queryKey, (ids) => withFavorite(ids, id, saved));
    },
    // Só confere com o backend depois do último toque, para uma resposta antiga não desfazer os seguintes
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: MUTATION_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey });
      }
      return undefined;
    },
  };
};

export const useFavorites = () => {
  const { auth } = useSession();
  const queryClient = useQueryClient();
  const isClient = auth?.tipo === "CLIENTE";
  const [guestIds, setGuestIds] = useState([]);
  const saved = useQuery({
    queryKey: queryKeyFor(auth?.id),
    queryFn: api.favorites.listIds,
    enabled: isClient,
  });
  const toggle = useMutation(favoriteToggleOptions(queryClient, auth?.id));

  const toggleFavoriteProfessional = (id) => {
    if (!isClient) {
      setGuestIds((ids) => withFavorite(ids, id, !ids.includes(id)));
      return;
    }
    // Lê do cache, e não do que a tela mostrou, para dois toques seguidos não repetirem a mesma ação
    const current = queryClient.getQueryData(queryKeyFor(auth.id)) ?? [];
    toggle.mutate({ id, saved: current.includes(id) });
  };

  return {
    favoriteProIds: isClient ? (saved.data ?? []) : guestIds,
    toggleFavoriteProfessional,
  };
};
