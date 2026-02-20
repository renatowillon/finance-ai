import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fecharFaturaFetch } from "../fetche/fecharFaturaFetch";
import { ReabrirFatura } from "../fetche/faturaFetch";

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

  const reaberturaFaturaMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => ReabrirFatura(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fatura-fechada"] }),
    onError: (error) => {
      console.error("Erro ao reabrir fatura: ", error);
    },
  });

  return {
    fechamentoFaturaMutation,
    reaberturaFaturaMutation,
  };
};
