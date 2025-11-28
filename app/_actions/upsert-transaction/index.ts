"use server";

import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { esquemaInserirOuAtualizarTransacao } from "./schema";
import { revalidatePath } from "next/cache";
import { obterUsuarioPorToken } from "@/app/_lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { canUserAddTransaction } from "@/app/_data/can-user-add-transaction";
import { getCurrentMonthTransactions } from "@/app/_data/get-current-month-transaction";

interface ParametrosInserirOuAtualizarTransacao {
  id?: string;
  nome: string;
  tipo: TransactionType;
  valor: number;
  categoriaId: number;
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

  console.log(">>> repeteQtd:", parametros.repeteQtd);
  console.log(">>> repetePeriodo:", parametros.repetePeriodo);
  console.log(">>> tipo repetePeriodo:", typeof parametros.repetePeriodo);

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }

  const idUsuario = usuario.userId;

  // ✅ VALIDAÇÃO DO LIMITE AQUI
  const podeAdicionar = await canUserAddTransaction();
  if (!podeAdicionar) {
    throw new Error(
      "Você atingiu o limite de 10 transações no plano FREE. Assine o plano Premium para continuar.",
    );
  }

  const dadosTransacao = {
    name: parametros.nome,
    type: parametros.tipo,
    amount: parametros.valor,
    categoriaId: Number(parametros.categoriaId),
    date: parametros.data,
    userId: idUsuario,
    bancoId: parametros.bancoId,
    baixado: parametros.baixado,
    repete: parametros.repeteQtd ? true : false,
    repeteQtd: parametros.repeteQtd ?? null,
    repetePeriodo: parametros.repetePeriodo ?? null,
  };

  // ⚙️ ATUALIZAÇÃO
  if (parametros.id) {
    await db.transaction.update({
      where: { id: parametros.id },
      data: dadosTransacao,
    });
  } else {
    // ✅ ANTES DE CRIAR REPETIÇÕES, VERIFICA O TOTAL QUE SERÁ CRIADO
    if (parametros.repeteQtd) {
      const totalNoMes = await getCurrentMonthTransactions(String(idUsuario));

      const totalQueSeraCriado = parametros.repeteQtd; // 1 principal + (repeteQtd - 1 repetições)

      if (!podeAdicionar && totalNoMes + totalQueSeraCriado > 10) {
        throw new Error(
          "Essa transação repetida ultrapassaria seu limite mensal de 10 transações no plano FREE.",
        );
      }
    }

    const transacaoPrincipal = await db.transaction.create({
      data: dadosTransacao,
    });

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
