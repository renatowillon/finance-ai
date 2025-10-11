import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeInvestimentoInput } from "../types";

import {
  atualizarInvestimento,
  criarInvestimento,
  deletarInvestimento,
} from "../fetche/investimentoFetch";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: criarInvestimento,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investimento"] }),
    onError: (error) => {
      console.error("Erro ao criar investimento:", error);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({
      id,
      investimento,
    }: {
      id: number;
      investimento: TypeInvestimentoInput;
    }) => atualizarInvestimento(id, investimento),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investimento"] }),
    onError: (error) => {
      console.error("Erro ao atualizar investimento:", error);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: deletarInvestimento,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investimento"] }),
    onError: (error) => {
      console.error("Erro ao deletar investimento:", error);
    },
  });

  return { criarMutation, atualizarMutation, deletarMutation };
};
