import {
  TransactionCategory,
  TransactionPaymentMethods,
  TransactionType,
} from "@prisma/client";
import { z } from "zod";

export const esquemaInserirOuAtualizarTransacao = z.object({
  nome: z.string().trim().min(1),
  valor: z.number().positive(),
  tipo: z.nativeEnum(TransactionType),
  categoria: z.nativeEnum(TransactionCategory),
  metodoPagamento: z.nativeEnum(TransactionPaymentMethods),
  data: z.date(),
});
