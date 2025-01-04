"use client";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import { Button } from "@/app/_components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const TRANSACTION_CATEGORY_LABELS = {
  SALARIO: "Salário",
  INVESTIMENTOS: "Investimentos",
  FREELANCER: "Freelancer",
  VENDAS: "Vendas",
  REEMBOLSOS: "Reembolsos",
  EMPRESTIMOS: "Empréstimos",
  ALUGUEIS: "Alugueis",
  PREMIOS: "Prémios",
  DOACOES: "Doações",
  OUTROS: "Outros",
  ALIMENTACAO: "Alimentação",
  TRANSPORTE: "Transporte",
  MORADIA: "Moradia",
  SAUDE: "Saúde",
  EDUCACAO: "Educação",
  ENTRETENIMENTO: "Entertenimento",
  ROUPAS: "Rpudas",
  VIAGENS: "Viagens",
  CONTAS: "contas",
  OUTRAS: "Outras",
};

export const TRANSACTION_PAYMENT_METHOD_LABEL = {
  PIX: "Pix",
  TRANSFERENCIA: "Transferência",
  BOLETO: "Boleto",
  DINHEIRO: "Dinheiro",
  CARTAO_DEBITO: "Cartão de Débito",
  CARTAO_CREDITO: "Cartão de Crédito",
};

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
      TRANSACTION_CATEGORY_LABELS[transaction.category],
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENT_METHOD_LABEL[transaction.paymentMethod],
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
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
    cell: () => {
      return (
        <div className="space-x-1">
          <Button variant="ghost" size="icon">
            <EditIcon />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2Icon />
          </Button>
        </div>
      );
    },
  },
];
