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

export const parseMoney = (value: string | number) => {
  if (!value) return 0;

  return Number(
    String(value)
      .replace(/[^\d,.-]/g, "") // remove letras (RS), símbolos, espaços
      .replace(/\./g, "") // remove milhar
      .replace(",", "."), // decimal
  );
};
