"use client";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import { Button } from "@/app/_components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  ROTULOS_CATEGORIAS_TRANSACAO,
  // ROTULOS_METODOS_PAGAMENTO_TRANSACAO,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transaction-button";
import { excluirTransacao } from "@/app/_actions/delete-transaction";
import { BancosTransacao } from "../_components/bancos-transacao";
import { Badge } from "@/app/_components/ui/badge";
import { formatCurrency } from "@/app/_utils/currency";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const TransactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => (
      <Badge className="w-32 items-center justify-center bg-muted/90 text-muted-foreground hover:bg-muted/90">
        {ROTULOS_CATEGORIAS_TRANSACAO[transaction.category]}
      </Badge>
    ),
  },
  {
    accessorKey: "bancoId",
    header: "Banco",
    cell: ({ row: { original: transaction } }) => (
      <BancosTransacao idBanco={transaction.bancoId} />
    ),
  },
  // {
  //   accessorKey: "paymentMethod",
  //   header: "Método de Pagamento",
  //   cell: ({ row: { original: transaction } }) =>
  //     ROTULOS_METODOS_PAGAMENTO_TRANSACAO[transaction.paymentMethod],
  // },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) => (
      <div
        className={`${transaction.type === "DESPESA" ? "text-red-600" : transaction.type === "DEPOSITO" ? "text-green-500" : transaction.type === "INVESTIMENTO" ? "text-violet-500" : ""}`}
      >
        {formatCurrency(Number(transaction.amount))}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="space-x-1">
          <EditTransactionButton transacao={transaction} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => excluirTransacao(transaction.id)}
          >
            <Trash2Icon />
          </Button>
        </div>
      );
    },
  },
];
