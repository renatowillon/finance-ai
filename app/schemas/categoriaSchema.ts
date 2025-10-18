import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "Máximo de 50 caracteres"),
  tipo: z.enum(["DESPESA", "DEPOSITO"], {
    required_error: "Selecione o tipo da categoria",
  }),
  userId: z.number({ required_error: "Usuario não identificado" }),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;
