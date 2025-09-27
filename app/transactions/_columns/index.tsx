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
    cell: ({ row: { original: transaction } }) =>
      ROTULOS_CATEGORIAS_TRANSACAO[transaction.category],
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
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(transaction.amount)),
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
