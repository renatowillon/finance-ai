"use client";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import { Check, Pin } from "lucide-react";
import EditTransactionButton from "../_components/edit-transaction-button";
import { BancosTransacao } from "../_components/bancos-transacao";
import { Badge } from "@/app/_components/ui/badge";
import { formatCurrency } from "@/app/_utils/currency";
import { ConfirmarDelete } from "../_components/confirmDelete";
import { ConfirmarBaixa } from "../_components/confirmBaixa";
import { EstonarBaixa } from "../_components/estornoBaixa";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type TransactionWithCategoria = Prisma.TransactionGetPayload<{
  include: { categoria: true };
}>;

export const TransactionsColumns: ColumnDef<TransactionWithCategoria>[] = [
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
    accessorKey: "categoriaId",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => (
      <Badge className="w-32 items-center justify-center bg-muted/90 text-muted-foreground hover:bg-muted/90">
        {transaction.categoria?.nome}
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
        className={`${transaction.type === "DESPESA" ? "text-red-600" : transaction.type === "DEPOSITO" ? "text-green-500" : transaction.type === "INVESTIMENTO" ? "text-violet-500" : transaction.type === "CARTAOCREDITO" ? "text-violet-500" : ""}`}
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
          <ConfirmarDelete transacao={transaction} />
          {transaction.baixado === false ? (
            <ConfirmarBaixa transacao={transaction} />
          ) : (
            <EstonarBaixa transacao={transaction} />
          )}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => excluirTransacao(transaction.id)}
          >
            <Trash2Icon />
          </Button> */}
        </div>
      );
    },
  },

  {
    accessorKey: "baixado",
    header: "",
    cell: ({ row: { original: transaction } }) =>
      transaction.baixado === true ? (
        <div className="flex size-5 items-center justify-center rounded-full bg-green-500 p-1 text-green-100">
          <Check size={30} />
        </div>
      ) : (
        <div className="flex size-5 items-center justify-center rounded-full bg-red-500 p-1 text-red-100">
          <Pin size={30} />
        </div>
      ),
  },
];
