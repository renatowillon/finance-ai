// /lib/finance/periodResolver.ts
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns";

export type Periodo =
  | "HOJE"
  | "SEMANA"
  | "MES"
  | "MES_PASSADO"
  | "ANO"
  | "PERSONALIZADO";

export function resolverPeriodo(
  periodo: Periodo,
  dataInicio?: Date,
  dataFim?: Date,
) {
  const now = new Date();

  switch (periodo) {
    case "HOJE":
      return {
        inicio: startOfDay(now),
        fim: endOfDay(now),
      };

    case "MES":
      return {
        inicio: startOfMonth(now),
        fim: endOfMonth(now),
      };

    case "SEMANA":
      return {
        inicio: startOfWeek(now, { weekStartsOn: 1 }),
        fim: endOfWeek(now, { weekStartsOn: 1 }),
      };

    case "MES_PASSADO":
      const mesPassado = subMonths(now, 1);
      return {
        inicio: startOfMonth(mesPassado),
        fim: endOfMonth(mesPassado),
      };

    case "ANO":
      return {
        inicio: startOfYear(now),
        fim: endOfYear(now),
      };

    case "PERSONALIZADO":
      if (!dataInicio || !dataFim) {
        throw new Error("Período personalizado requer dataInicio e dataFim");
      }
      return { inicio: dataInicio, fim: dataFim };

    default:
      throw new Error("Período inválido");
  }
}
