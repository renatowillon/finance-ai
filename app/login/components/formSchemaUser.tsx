"use client";

import { z } from "zod";
export const formSchemaUser = z.object({
  email: z.string().email(),
  senha: z
    .string()
    .min(3, { message: "senha deve conter no minimo 3 digitos" }),
});
