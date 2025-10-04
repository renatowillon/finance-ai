"use server";

import { db } from "@/app/_lib/prisma";

import {
  TransactionCategory,
  TransactionPaymentMethods,
  TransactionType,
} from "@prisma/client";
import { esquemaInserirOuAtualizarTransacao } from "./schema";
import { revalidatePath } from "next/cache";
import { obterUsuarioPorToken } from "@/app/_lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ParametrosInserirOuAtualizarTransacao {
  id?: string;
  nome: string;
  tipo: TransactionType;
  valor: number;
  categoria: TransactionCategory;
  metodoPagamento: TransactionPaymentMethods;
  data: Date;
  bancoId: number;
  baixado: boolean;
}

export const inserirOuAtualizarTransacao = async (
  parametros: ParametrosInserirOuAtualizarTransacao,
) => {
  esquemaInserirOuAtualizarTransacao.parse(parametros);
  const armazenadorCookie = cookies();
  const token = armazenadorCookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }
  const idUsuario = usuario.userId;

  // Mapeando os campos traduzidos para os campos do banco
  const dadosTransacao = {
    name: parametros.nome,
    type: parametros.tipo,
    amount: parametros.valor,
    category: parametros.categoria,
    paymentMethod: parametros.metodoPagamento,
    date: parametros.data,
    userId: idUsuario,
    bancoId: parametros.bancoId,
    baixado: parametros.baixado,
  };

  await db.transaction.upsert({
    update: dadosTransacao,
    create: dadosTransacao,
    where: {
      id: parametros.id ?? "",
    },
  });
  revalidatePath("/transaction");
};
