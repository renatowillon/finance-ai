import AddTransactionButton from "@/app/_components/add-transactions-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { ReactNode } from "react";

interface SumaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size: "small" | "large";
  userCanAddTransaction?: boolean;
  className?: string;
  onClick?: () => void;
  valorPago?: number;
  valorPendente?: number;
}

const SumaryCard = ({
  icon,
  title,
  amount,
  size,
  userCanAddTransaction,
  className,
  onClick,
  valorPago,
  valorPendente,
}: SumaryCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        `${size === "large" ? "bg-white bg-opacity-5" : ""} bg-azulEscuro`,
        className,
      )}
    >
      <CardHeader className="flex-row items-center gap-4">
        <p className="gap-2 rounded-lg bg-primary/5 p-1 md:p-3">{icon}</p>
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col justify-between space-y-2 sm:flex-row">
        <p
          className={`font-bold ${size === "small" ? "text-base" : "text-2xl"}`}
        >
          {formatCurrency(amount)}
        </p>
        <div className="self-end font-bold text-muted-foreground">
          {valorPago != null && (
            <p
              className={`flex justify-end gap-2 ${size === "small" ? "text-xs" : "text-2xl"}`}
            >
              <span>Pagos:</span> {formatCurrency(valorPago)}
            </p>
          )}
          {valorPendente != null && (
            <p
              className={`flex justify-end gap-2 ${size === "small" ? "text-xs" : "text-2xl"}`}
            >
              <span>Pendente:</span> {formatCurrency(valorPendente)}
            </p>
          )}
        </div>

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
