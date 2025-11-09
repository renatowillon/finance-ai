import AddTransactionButton from "@/app/_components/add-transactions-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { cn } from "@/app/_lib/utils";
import { ReactNode } from "react";

interface SumaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size: "small" | "large";
  userCanAddTransaction?: boolean;
  className?: string;
}

const SumaryCard = ({
  icon,
  title,
  amount,
  size,
  userCanAddTransaction,
  className,
}: SumaryCardProps) => {
  return (
    <Card
      className={cn(
        `${size === "large" ? "bg-white bg-opacity-5" : ""}`,
        className,
      )}
    >
      <CardHeader className="flex-row items-center gap-4">
        <p className="gap-2 rounded-lg bg-primary/5 p-3">{icon}</p>
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col justify-between space-y-2 sm:flex-row">
        <p className={`font-bold ${size === "small" ? "text-xl" : "text-4xl"}`}>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>
        {size === "large" && (
          <AddTransactionButton
            usuarioPodeAdicionarTransacao={userCanAddTransaction}
          />
        )}
      </CardContent>
    </Card>
  );
};
export default SumaryCard;
