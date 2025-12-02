import { z } from "zod";

export const CartaoSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Máximo de 50 caracteres"),
  limite: z.coerce
    .number({ required_error: "Preencha o limite do cartão." })
    .positive({ message: "Preencha com valor positivo" }),
  diaFechamento: z.coerce
    .number({ required_error: "Preencha o dia de fechamento da fatura." })
    .positive({ message: "Preencha com valor positivo" }),
  diaVencimento: z.coerce
    .number({ required_error: "Preencha o dia de vencimento da fatura." })
    .positive({ message: "Preencha com valor positivo" }),
  cor: z.string(),
  userId: z.number({ required_error: "Usuario não identificado" }),
});

export type cartaoSchemaFormData = z.infer<typeof CartaoSchema>;
