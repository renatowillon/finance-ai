import { Card } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface CardDashboardProps {
  titulo: string;
  valor: string;
  descricao: string;
  icon: ReactNode;
}

export const CardDashboard = ({
  titulo,
  descricao,
  icon,
  valor,
}: CardDashboardProps) => {
  return (
    <Card className="space-y-3 bg-azulEscuro p-6 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{titulo}</p>
        <p>{icon}</p>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-black">{valor}</div>
        <div className="text-xs text-muted-foreground">{descricao}</div>
      </div>
    </Card>
  );
};
