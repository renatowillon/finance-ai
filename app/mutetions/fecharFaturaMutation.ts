import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fecharFaturaFetch } from "../fetche/fecharFaturaFetch";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const fechamentoFaturaMutation = useMutation({
    mutationFn: ({
      competencia,
      cartaoCreditoId,
    }: {
      competencia: string;
      cartaoCreditoId: string;
    }) => fecharFaturaFetch(competencia, cartaoCreditoId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fatura-fechada"] }),
    onError: (error) => {
      console.error("Erro ao fechar fatura: ", error);
    },
  });
  return {
    fechamentoFaturaMutation,
  };
};
