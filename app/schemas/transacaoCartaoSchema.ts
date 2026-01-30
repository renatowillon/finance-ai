import { z } from "zod";

export const TransacaoCartaoSchama = z.object({
  descricao: z
    .string({ required_error: "Descrição Obrigatória" })
    .min(1, { message: "Preencher Descrição" }),
  valor: z
    .string({ required_error: "Valor Obrigatório" })
    .min(1, { message: "Preencher o valor" }),
  dataCompra: z.union([z.date(), z.string()]),
  parcelada: z.boolean(),
  parcelaAtual: z.number().nullable().optional(),
  totalParcelas: z.number().nullable().optional(),
  competencia: z.union([z.date(), z.string()]),
  pago: z.boolean(),
  dataPagamento: z.union([z.date(), z.string(), z.null()]),
  cartaoCreditoId: z.string(),
});
