// Consultas de profissionais (lista e detalhe) e do usuário logado · api.professionals, api.appointments, api.reviews
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";
import { distanceKm } from "../../shared/utils/geo";

// Onde a cliente está, pelo perfil dela. Sem login ou sem coordenadas, não há distância.
const useMyCoordinates = () => {
  const { auth } = useSession();
  return useQuery({
    queryKey: ["profile", auth?.id],
    queryFn: api.profile.getMine,
    enabled: auth?.tipo === "CLIENTE",
  }).data;
};

const withDistance = (pro, me) => ({ ...pro, distance: distanceKm(me, pro) });

export const useProfessionals = () => {
  const me = useMyCoordinates();
  const query = useQuery({ queryKey: ["professionals"], queryFn: api.professionals.list });
  const data = useMemo(() => query.data?.map((pro) => withDistance(pro, me)), [query.data, me]);
  return { ...query, data };
};

export const useProfessional = (id) => {
  const me = useMyCoordinates();
  const query = useQuery({ queryKey: ["professional", id], queryFn: () => api.professionals.get(id), enabled: !!id });
  const data = useMemo(() => query.data && withDistance(query.data, me), [query.data, me]);
  return { ...query, data };
};

export const useMyAppointments = () =>
  useQuery({ queryKey: ["appointments", "mine"], queryFn: api.appointments.listMine });

export const useMyReviews = () => useQuery({ queryKey: ["reviews", "mine"], queryFn: api.reviews.listMine });
