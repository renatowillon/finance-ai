import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fecharFaturaFetch } from "../fetche/fecharFaturaFetch";
import { pagarFatura, ReabrirFatura } from "../fetche/faturaFetch";

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

  const pagamentoFaturaMutation = useMutation({
    mutationFn: ({
      faturaId,
      valorPago,
      bancoId,
    }: {
      faturaId: string;
      valorPago: string;
      bancoId: number;
    }) => pagarFatura({ faturaId, valorPago, bancoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fatura-cartao"] });
      queryClient.invalidateQueries({
        queryKey: ["historico-pagamento-fatura"],
      });
      queryClient.invalidateQueries({ queryKey: ["saldo"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      console.error("Erro ao pagar fatura: ", error);
    },
  });

  return {
    fechamentoFaturaMutation,
    reaberturaFaturaMutation,
    pagamentoFaturaMutation,
  };
};
