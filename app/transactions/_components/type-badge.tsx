import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionsTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionsTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSITO) {
    return (
      <Badge className="bg-green-600/40 font-bold hover:bg-green-600/40">
        <CircleIcon size={10} className="mr-2 fill-green-600 text-green-600" />{" "}
        Depósito
      </Badge>
    );
  }
  if (transaction.type === TransactionType.DESPESA) {
    return (
      <Badge className="bg-red-600/40 font-bold hover:bg-red-600/40">
        <CircleIcon size={10} className="mr-2 fill-red-600 text-red-600" />
        Despesas
      </Badge>
    );
  }
  if (transaction.type === TransactionType.INVESTIMENTO) {
    return (
      <Badge className="hover:bg-violet-600-600/40 bg-violet-600/40 font-bold">
        <CircleIcon
          size={10}
          className="mr-2 fill-violet-600 text-violet-600"
        />
        Investimento
      </Badge>
    );
  }
};
export default TransactionTypeBadge;
