import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { pegarUmaCategoria } from "../fetche/categoriaFetch";
import { TypeCategoria } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pegarCategoria = async (id: number) => {
  const categoria: TypeCategoria = await pegarUmaCategoria(id);
  return categoria.nome;
};
