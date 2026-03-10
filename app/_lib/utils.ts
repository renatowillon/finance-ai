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

  const raw = String(value).trim();
  const cleaned = raw.replace(/[^\d,.-]/g, "");
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  if (hasComma && hasDot) {
    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");
    if (lastComma > lastDot) {
      return Number(cleaned.replace(/\./g, "").replace(",", "."));
    }
    return Number(cleaned.replace(/,/g, ""));
  }

  if (hasComma) {
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }

  return Number(cleaned.replace(/,/g, ""));
};
