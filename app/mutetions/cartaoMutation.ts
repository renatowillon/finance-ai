import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  atualizarCartao,
  criarCartao,
  deletarCartao,
} from "../fetche/cartaoFetch";
import { TypeCartaoCredito } from "../types";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: criarCartao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cartao"] }),
    onError: (error) => {
      console.error("Erro ao criar cartão:", error);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, cartao }: { id: string; cartao: TypeCartaoCredito }) =>
      atualizarCartao(id, cartao),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cartao"] }),
    onError: (error) => {
      console.error("Erro ao atualizar cartão:", error);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: deletarCartao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cartao"] }),
    onError: (error) => {
      console.error("Error ao deletar cartão: ", error);
    },
  });

  return { criarMutation, atualizarMutation, deletarMutation };
};
