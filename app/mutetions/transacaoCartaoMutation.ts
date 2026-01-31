import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  atualizarTransacaoCartao,
  criarTransacaoCartao,
  deletarTransacaoCartao,
  pegarTransacaoPorCartao,
} from "../fetche/transacaoCartao";
import { TypeTransacaoCartao } from "../types";

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

  const criarTransacaoCartaoMutation = useMutation({
    mutationFn: criarTransacaoCartao,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transacaoCartao"] }),
    onError: (error) => {
      console.error("Erro ao criar transação do cartão: ", error);
    },
  });

  const editarTransacaoCartaoMutation = useMutation({
    mutationFn: ({
      id,
      transacaoCartao,
    }: {
      id: string;
      transacaoCartao: TypeTransacaoCartao;
    }) => atualizarTransacaoCartao(id, transacaoCartao),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transacaoCartao"] }),
    onError: (error) => {
      console.error("Erro ao editar transação do cartão: ", error);
    },
  });

  const deletarTransacaoCartaoMutation = useMutation({
    mutationFn: deletarTransacaoCartao,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transacaoCartao"] }),
    onError: (error) => {
      console.error("Erro ao deletar transação do cartão: ", error);
    },
  });

  return {
    pegarTransacaoPorCartaoMutation,
    criarTransacaoCartaoMutation,
    editarTransacaoCartaoMutation,
    deletarTransacaoCartaoMutation,
  };
};
