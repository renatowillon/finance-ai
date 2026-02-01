import { TypeTransacaoCartao } from "../types";

export function calcularCompetencia(
  dataCompra: Date,
  diaFechamento: number,
): Date {
  if (!(dataCompra instanceof Date) || isNaN(dataCompra.getTime())) {
    throw new Error("Data de compra inválida");
  }

  const ano = dataCompra.getUTCFullYear();
  const mes = dataCompra.getUTCMonth();
  const dia = dataCompra.getUTCDate();

  let competenciaMes = mes;
  let competenciaAno = ano;

  if (dia >= diaFechamento) {
    competenciaMes += 1;
  }

  if (competenciaMes > 11) {
    competenciaMes = 0;
    competenciaAno += 1;
  }

  return new Date(Date.UTC(competenciaAno, competenciaMes, 1));
}

export function adicionarMeses(data: Date, meses: number): Date {
  if (!(data instanceof Date) || isNaN(data.getTime())) {
    throw new Error("Data inválida em adicionarMeses");
  }

  return new Date(data.getFullYear(), data.getMonth() + meses, 1);
}

type MesCompetencia = {
  label: string; // ex: "02/2026"
  value: string; // ex: "2026-02"
};

export function obterMesesComTransacoes(
  transacoes: TypeTransacaoCartao[],
): MesCompetencia[] {
  const mapa = new Map<string, MesCompetencia>();

  transacoes?.forEach((t) => {
    if (!t.competencia) return;

    const data = new Date(t.competencia);
    if (isNaN(data.getTime())) return;

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");

    const value = `${ano}-${mes}`; // usado no estado
    const label = `${mes}/${ano}`; // exibido no UI

    mapa.set(value, { value, label });
  });

  // ordena cronologicamente
  return Array.from(mapa.values()).sort((a, b) =>
    a.value.localeCompare(b.value),
  );
}

export const obterStatusFatura = (transacoes: TypeTransacaoCartao[]) => {
  if (!transacoes || transacoes.length === 0) {
    return "Fatura aberta";
  }
  const todasPagas = transacoes.every((t) => t.pago === true);
  return todasPagas ? "Fatura paga" : "Fatura aberta";
};

export function calcularVencimento(
  competencia: Date,
  diaVencimento: number,
): Date {
  const ano = competencia.getFullYear();
  const mes = competencia.getMonth(); // 0-based

  // mês seguinte
  return new Date(ano, mes + 1, diaVencimento);
}
