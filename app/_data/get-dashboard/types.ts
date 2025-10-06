import { TransactionType } from "@prisma/client";

export type PorcentagemTransacaoPorTipo = {
  [key in TransactionType]: number;
};

export interface TotalDespesaPorCategoria {
  categoria: number;
  valorTotal: number;
  porcentagemDoTotal: number;
  categoriaNome: string;
}
