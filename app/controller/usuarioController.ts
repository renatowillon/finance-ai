import { db } from "../_lib/prisma";
import { TypeUsuario } from "../types";

export const AdicionaUsuario = async (data: TypeUsuario) => {
  return db.user.create({ data });
};

export const AtualizarUsuario = async (id: number, data: TypeUsuario) => {
  return db.user.update({
    where: { id },
    data,
  });
};
