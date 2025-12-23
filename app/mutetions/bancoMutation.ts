import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atualizarBanco, criarBanco, deletarBanco } from "../fetche/bancoFetch";
import { TypeBanco } from "../types";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: criarBanco,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bancos"] }),
    onError: (error) => {
      console.error("Erro ao criar banco:", error);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, banco }: { id: number; banco: TypeBanco }) =>
      atualizarBanco(id, banco),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bancos"] }),
    onError: (error) => {
      console.error("Erro ao atualizar banco:", error);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: deletarBanco,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bancos"] }),
    onError: (error) => {
      console.error("Erro ao deletar banco:", error);
    },
  });

  return { criarMutation, atualizarMutation, deletarMutation };
};
