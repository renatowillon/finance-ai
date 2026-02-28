import { z } from "zod";

export const AiIntentSchema = z.object({
  intencao: z
    .enum([
      "criar_transacao",
      "consultar_resumo",
      "consultar_insights",
      "encerrar_conversa",
    ])
    .nullable(),

  periodo: z.enum(["HOJE", "SEMANA", "MES", "MES_PASSADO", "ANO"]).nullable(),
  consulta: z
    .enum([
      "RESUMO_GERAL",
      "SALDO_BANCO",
      "GASTO_PERIODO",
      "FATURA_CARTAO",
      "CATEGORIA_MAIS_GASTA",
      "LISTAR_CATEGORIAS",
    ])
    .nullable(),

  tipo: z.enum(["cartao", "banco"]).nullable(),

  descricao: z.string().nullable(),
  valor: z.number().nullable(),

  movimento: z.enum(["DESPESA", "DEPOSITO"]).nullable(),
  categoriaNome: z.string().nullable(),

  cartaoNome: z.string().nullable(),
  bancoNome: z.string().nullable(),
  competenciaMes: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .nullable()
    .optional(),

  parcelada: z.boolean().nullable(),
  totalParcelas: z.number().nullable(),

  completo: z.boolean(),
  pergunta: z.string().nullable(),
});

export type AiIntent = z.infer<typeof AiIntentSchema>;
