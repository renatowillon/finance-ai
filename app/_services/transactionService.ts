import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";

interface CriarTransacaoDTO {
  nome: string;
  tipo: TransactionType;
  valor: string;
  categoriaId: number;
  data: Date;
  bancoId: number;
  baixado: boolean;
  userId: number;
}

export async function criarTransacaoService(data: CriarTransacaoDTO) {
  return db.transaction.create({
    data: {
      name: data.nome,
      type: data.tipo,
      amount: data.valor,
      categoriaId: data.categoriaId,
      date: data.data,
      userId: data.userId,
      bancoId: data.bancoId,
      baixado: data.baixado,
    },
  });
}
