import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeCategoria } from "../types";
import {
  atualizarCategoria,
  criarCategoria,
  deletarCategoria,
} from "../fetche/categoriaFetch";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: criarCategoria,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categorias"] }),
    onError: (error) => {
      console.error("Erro ao criar categorias:", error);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({
      id,
      categorias,
    }: {
      id: number;
      categorias: TypeCategoria;
    }) => atualizarCategoria(id, categorias),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categorias"] }),
    onError: (error) => {
      console.error("Erro ao atualizar categorias:", error);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: deletarCategoria,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categorias"] }),
    onError: (error) => {
      console.error("Erro ao deletar categorias:", error);
    },
  });

  return { criarMutation, atualizarMutation, deletarMutation };
};
