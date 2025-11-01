"use server";

import { db } from "@/app/_lib/prisma";

import { TransactionPaymentMethods, TransactionType } from "@prisma/client";
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
  categoriaId: number;
  metodoPagamento: TransactionPaymentMethods;
  data: Date;
  bancoId: number;
  baixado: boolean;
  repete?: boolean;
  repeteQtd?: number;
  repetePeriodo?: number;
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
    categoriaId: Number(parametros.categoriaId),
    paymentMethod: parametros.metodoPagamento,
    date: parametros.data,
    userId: idUsuario,
    bancoId: parametros.bancoId,
    baixado: parametros.baixado,
    repete: parametros.repeteQtd ? true : false,
    repeteQtd: parametros.repeteQtd ?? null,
    repetePeriodo: parametros.repetePeriodo ?? null,
  };

  // ⚙️ SE FOR ATUALIZAÇÃO
  if (parametros.id) {
    await db.transaction.update({
      where: { id: parametros.id },
      data: dadosTransacao,
    });
  } else {
    // ⚙️ SE FOR NOVA TRANSAÇÃO
    const transacaoPrincipal = await db.transaction.create({
      data: dadosTransacao,
    });

    // 🔁 SE FOR RECORRENTE, CRIA AS REPETIÇÕES
    if (parametros.repeteQtd && parametros.repetePeriodo) {
      const transacoesRepetidas = [];

      for (let i = 1; i < parametros.repeteQtd; i++) {
        const novaData = new Date(parametros.data);
        novaData.setDate(novaData.getDate() + parametros.repetePeriodo * i);

        transacoesRepetidas.push({
          ...dadosTransacao,
          date: novaData,
          repeteId: transacaoPrincipal.id,
        });
      }

      if (transacoesRepetidas.length > 0) {
        await db.transaction.createMany({
          data: transacoesRepetidas,
        });
      }
    }
  }

  revalidatePath("/transaction");
};
