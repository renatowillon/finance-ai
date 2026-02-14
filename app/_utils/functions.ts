import { format } from "date-fns";

export function dataFormatada(data: Date) {
  const dataNova = format(data, "dd/MM/yyyy");
  return dataNova;
}

export function dataCompetencia(data: Date) {
  const dataNova = format(data, "MM/yyyy");
  return dataNova;
}

export function dataCompetenciaUtc(data: Date | string) {
  const dateObj = new Date(data);

  const mes = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const ano = dateObj.getUTCFullYear();

  return `${mes}/${ano}`;
}

export function dataFormatada2(data: Date) {
  new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarCompetencia(data: Date | string) {
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = d.getMonth() + 1;

  return `${String(mes).padStart(2, "0")}/${ano}`;
}

export function formatarTelefone(telefone: string): string {
  // Remove tudo que não é número
  if (!telefone) return "";
  const numeros = telefone.replace(/\D/g, "");

  // Aplica o padrão (99) 99999-9999
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
export function proximaCompetencia(mesRef: string): string {
  const [ano, mes] = mesRef.split("-").map(Number);

  if (mes === 12) {
    return `${ano + 1}-01`;
  }

  return `${ano}-${String(mes + 1).padStart(2, "0")}`;
}
