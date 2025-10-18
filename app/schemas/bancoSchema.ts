import { z } from "zod";

export const bancoSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Máximo de 50 caracteres"),
  tipo: z.enum(["POUPANCA", "CONTA_CORRENTE", "CARTAO_CREDITO"], {
    required_error: "Selecione o tipo da categoria",
  }),
  saldoInicial: z.coerce.number({
    required_error: "Preencha o valor da meta.",
  }),
  saldoAtual: z.coerce.number(),
  cor: z.string(),
  userId: z.number({ required_error: "Usuario não identificado" }),
});

export type BancoFormData = z.infer<typeof bancoSchema>;
