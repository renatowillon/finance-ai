import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { ICONES_METODOS_PAGAMENTO_TRANSACAO } from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const getPriceColor = (transaction: Transaction) => {
    if (transaction.type === TransactionType.DESPESA) {
      return "text-red-500";
    }
    if (transaction.type === TransactionType.DEPOSITO) {
      return "text-green-500";
    }
    if (transaction.type === TransactionType.INVESTIMENTO) {
      return "text-violet-500";
    }
  };
  const getAmountPrefix = (Transaction: Transaction) => {
    if (Transaction.type === TransactionType.DEPOSITO) {
      return "+";
    }
    return "-";
  };
  return (
    <ScrollArea className="rounded-md border bg-azulEscuro">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>
        <Button asChild variant="default" className="rounded-full font-bold">
          <Link href={"/transactions"}>Ver mais</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {lastTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-2 rounded-md bg-azulMuted p-2"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-white bg-opacity-[3%] p-2">
                <Image
                  src={
                    ICONES_METODOS_PAGAMENTO_TRANSACAO[
                      transaction.paymentMethod
                    ]
                  }
                  height={20}
                  width={20}
                  alt="Pix"
                />
              </div>
              <div>
                <p className="text-sm font-bold">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div
              className={`flex flex-row items-center justify-center text-sm font-bold ${getPriceColor(transaction)}`}
            >
              <p>{getAmountPrefix(transaction)}</p>
              <p>{formatCurrency(Number(transaction.amount))}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};
export default LastTransactions;
