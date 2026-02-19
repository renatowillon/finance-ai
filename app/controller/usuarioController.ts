import { db } from "../_lib/prisma";
import { TypeUsuario } from "../types";
import bcrypt from "bcrypt";

export const AdicionaUsuario = async (data: TypeUsuario) => {
  if (!data.senha) {
    throw new Error("Senha é obrigatória");
  }

  const senhaHash = await bcrypt.hash(data.senha, 10);

  return db.user.create({
    data: {
      ...data,
      senha: senhaHash,
    },
  });
};

export const AtualizarUsuario = async (id: number, data: TypeUsuario) => {
  const dadosAtualizado = { ...data };

  if (data.senha) {
    const senhaHash = await bcrypt.hash(data.senha, 10);
    dadosAtualizado.senha = senhaHash;
  }

  return db.user.update({
    where: { id },
    data: dadosAtualizado,
  });
};
