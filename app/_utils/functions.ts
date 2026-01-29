import { format } from "date-fns";

export function dataFormatada(data: Date) {
  const dataNova = format(data, "dd/MM/yyyy");
  return dataNova;
}

export function dataCompetencia(data: Date) {
  const dataNova = format(data, "MM/yyyy");
  return dataNova;
}

export function dataFormatada2(data: Date) {
  new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
export function formatarTelefone(telefone: string): string {
  // Remove tudo que não é número
  if (!telefone) return "";
  const numeros = telefone.replace(/\D/g, "");

  // Aplica o padrão (99) 99999-9999
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
