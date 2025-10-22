import { z } from "zod";

export const usuarioSchema = z.object({
  name: z
    .string({ required_error: "Digite um nome" })
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Máximo de 50 caracteres"),
  email: z
    .string({ required_error: "Digite um email" })
    .email({ message: "Digite um email" }),
  senha: z
    .string({ required_error: "Digite uma senha" })
    .min(3, "Mínimo 3 Caracteres"),
  status: z.boolean({ required_error: "Preencha o Status" }),
  plano: z.enum(["PREMIUM", "FREE", "DEV"], {
    required_error: "Selecione o plano",
  }),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
