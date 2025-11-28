import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const esquemaInserirOuAtualizarTransacao = z.object({
  nome: z.string().trim().min(1),
  valor: z.number().positive(),
  tipo: z.nativeEnum(TransactionType),
  categoriaId: z.number().optional().nullable(),
  data: z.date(),
});
