// Busca de endereço pelo CEP (preenche só os campos vazios) · API: ViaCEP
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { onlyDigits } from "../utils/format";

export function useCepLookup(setForm) {
  const mutation = useMutation({
    mutationFn: (cep) => api.address.lookupCep(cep),
    onSuccess: (found) =>
      setForm((f) => ({
        ...f,
        street: f.street || found.street,
        neighborhood: f.neighborhood || found.neighborhood,
        city: f.city || found.city,
        state: f.state || found.state,
      })),
  });
  const handleCepBlur = (form) => {
    if (onlyDigits(form.cep).length === 8) mutation.mutate(form.cep);
  };
  return { cepLoading: mutation.isPending, handleCepBlur };
}
