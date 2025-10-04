import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface Props {
  onClick?: () => void;
  titulo?: string;
  subtitulo?: string;
  tituloBotao?: string;
}

export const InfoSemDados = ({
  onClick,
  titulo,
  subtitulo,
  tituloBotao,
}: Props) => {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 bg-secondary/25 p-10">
      <p className="text-xl font-semibold">{titulo}</p>
      <p className="text-base text-gray-500">{subtitulo}</p>
      <Button onClick={onClick}>
        <Plus /> {tituloBotao}
      </Button>
    </Card>
  );
};
