import AddTransactionButton from "@/app/_components/add-transactions-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SumaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SumaryCard = ({
  icon,
  title,
  amount,
  size,
  userCanAddTransaction,
}: SumaryCardProps) => {
  return (
    <Card className={`${size === "large" ? "bg-white bg-opacity-5" : ""}`}>
      <CardHeader className="flex-row items-center gap-4">
        <p className="gap-2 rounded-lg bg-primary/5 p-3">{icon}</p>
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>
        {size === "large" && (
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        )}
      </CardContent>
    </Card>
  );
};
export default SumaryCard;
