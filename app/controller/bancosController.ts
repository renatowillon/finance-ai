import { Banco } from "@prisma/client";
import { db } from "../_lib/prisma";
import { TypeBanco } from "../types";

export const PegarBancos = async () => {
  return db.banco.findMany({ orderBy: { id: "asc" } });
};

export const PegarUmBanco = async (id: number) => {
  return db.banco.findUnique({
    where: { id },
  });
};

export const Adicionarbanco = async (data: TypeBanco) => {
  return db.banco.create({ data });
};

export const AtualizarBanco = async (id: number, data: Banco) => {
  return db.banco.update({
    where: { id },
    data,
  });
};

export const DeleteBanco = async (id: number) => {
  return db.banco.delete({ where: { id } });
};
