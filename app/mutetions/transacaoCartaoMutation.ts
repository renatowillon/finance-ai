import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pegarTransacaoPorCartao } from "../fetche/transacaoCartao";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const pegarTransacaoPorCartaoMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => pegarTransacaoPorCartao(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transacaoCartao"] }),
    onError: (error) => {
      console.error("Erro ao pegar transações do Cartão: ", error);
    },
  });
  return { pegarTransacaoPorCartaoMutation };
};
