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
