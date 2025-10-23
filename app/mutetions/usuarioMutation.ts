import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeUsuario } from "../types";
import { AtualizarUsuarios, CriarUsuario } from "../fetche/usuarioFetch";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: CriarUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, usuario }: { id: number; usuario: TypeUsuario }) =>
      AtualizarUsuarios(id, usuario),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
    onError: (error) => {
      console.error("Erro ao atualizar usuários:", error);
    },
  });

  return { criarMutation, atualizarMutation };
};
