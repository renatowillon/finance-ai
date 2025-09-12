import { TransactionCategory, TransactionType } from "@prisma/client";

export type PorcentagemTransacaoPorTipo = {
  [key in TransactionType]: number;
};

export interface TotalDespesaPorCategoria {
  categoria: TransactionCategory;
  valorTotal: number;
  porcentagemDoTotal: number;
}
