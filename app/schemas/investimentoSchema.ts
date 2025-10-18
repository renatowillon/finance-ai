import { z } from "zod";

export const InvestimentoSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Máximo de 50 caracteres"),
  descricao: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 Caracteres")
    .max(50, "Máximo de 50 caracteres"),
  meta: z.coerce
    .number({ required_error: "Preencha o valor da meta." })
    .positive({ message: "Preencha com valor positivo" }),

  userId: z.number({ required_error: "Usuario não identificado" }),
});

export type InvestimentoFormData = z.infer<typeof InvestimentoSchema>;

export const TransacaoInvestimentoSchema = z.object({
  tipo: z.enum(["DEPOSITO", "RETIRADA"]),
  investimentoId: z.number({
    required_error: "Investimento ID não identificado",
  }),
  valor: z.coerce
    .number({ required_error: "Preencha o valor." })
    .positive({ message: "Preencha com valor positivo" }),
  descricao: z.string().max(50, "Máximo de 50 caracteres").optional(),
});
