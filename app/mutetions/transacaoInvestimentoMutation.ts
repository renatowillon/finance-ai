import { useMutation, useQueryClient } from "@tanstack/react-query";
import { criarTransacaoInvestimento } from "../fetche/transacaoInvestimentoFetch";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: criarTransacaoInvestimento,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transacaoInvestimento"] }),
    onError: (error) => {
      console.error("Erro ao criar investimento:", error);
    },
  });

  return { criarMutation };
};
