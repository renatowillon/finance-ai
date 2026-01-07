import { Button } from "@/app/_components/ui/button";
import { UserPlus } from "lucide-react";

interface TituloPadraoProps {
  titulo: string | null | undefined;
  descricao: string;
  tituloButao?: string;
  onClick?: () => void;
}

export const TituloPadrao = ({
  titulo,
  onClick,
  tituloButao,
  descricao,
}: TituloPadraoProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row md:gap-0">
      <div className="space-y-1">
        <h1 className="text-2xl font-black md:text-4xl">{titulo}</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          {descricao}
        </p>
      </div>
      {tituloButao && (
        <Button onClick={onClick}>
          <UserPlus /> {tituloButao}
        </Button>
      )}
    </div>
  );
};
