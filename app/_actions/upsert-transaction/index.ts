"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma, TransactionType } from "@prisma/client";
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
  type TransacaoCriar = Omit<Prisma.TransactionUncheckedCreateInput, "id">;

  if (!token) redirect("/login");

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) redirect("/login");

  const idUsuario = usuario.userId;

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

  // ⚙️ ATUALIZAÇÃO NORMAL
  if (parametros.id) {
    await db.transaction.update({
      where: { id: parametros.id },
      data: dadosTransacao,
    });
  } else {
    // 🛑 VERIFICA LIMITE
    if (parametros.repeteQtd) {
      const totalNoMes = await getCurrentMonthTransactions(String(idUsuario));
      const totalQueSeraCriado = parametros.repeteQtd;

      if (!podeAdicionar && totalNoMes + totalQueSeraCriado > 10) {
        throw new Error(
          "Essa transação repetida ultrapassaria seu limite mensal de 10 transações no plano FREE.",
        );
      }
    }

    // 🟢 Define nome da primeira recorrência
    const nomeBase = parametros.nome;
    let nomePrincipal = nomeBase;

    if (parametros.repeteQtd && parametros.repeteQtd > 1) {
      nomePrincipal = `${nomeBase} 1/${parametros.repeteQtd}`;
    }

    const transacaoPrincipal = await db.transaction.create({
      data: {
        ...dadosTransacao,
        name: nomePrincipal,
      },
    });

    // 🔁 Repetições
    if (parametros.repeteQtd && parametros.repetePeriodo) {
      const transacoesRepetidas: TransacaoCriar[] = [];

      let dataAnterior = new Date(parametros.data); // <- BASE VAI ATUALIZANDO

      for (let i = 1; i < parametros.repeteQtd; i++) {
        const numero = i + 1;

        let novaData = new Date(dataAnterior); // <- sempre usa a última data

        if (parametros.repetePeriodo === 30) {
          const diaOriginal = dataAnterior.getDate();

          const ano = dataAnterior.getFullYear();
          const mes = dataAnterior.getMonth() + 1; // próximo mês

          const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();

          novaData = new Date(ano, mes, Math.min(diaOriginal, ultimoDiaMes));
        } else {
          novaData.setDate(dataAnterior.getDate() + parametros.repetePeriodo);
        }

        // Atualiza a base para próxima repetição
        dataAnterior = new Date(novaData);

        transacoesRepetidas.push({
          ...dadosTransacao,
          name: `${nomeBase} ${numero}/${parametros.repeteQtd}`,
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
