import { Badge } from "@/app/_components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  cartaoId: string | null | undefined;
}

export const DetalheFatura = ({ cartaoId }: Props) => {
  if (!cartaoId) return null;
  return (
    <div>
      {/* menu de calendario e faturas */}
      <div className="w-full rounded-lg border">
        <div className="flex items-center justify-center gap-3 p-5 text-center">
          <div>
            <ChevronLeft />
          </div>
          <div className="">
            <p className="flex gap-3 text-xl font-bold">
              <Calendar size={25} /> Janeiro 2026
            </p>
            <p>
              <Badge variant={"outline"}>Fatura aberta</Badge>
            </p>
          </div>
          <div>
            <ChevronRight />{" "}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-3">
            <Badge>Janeiro</Badge>
            <Badge>Fevereiro</Badge>
          </div>
          <p className="animate-pulse">
            BADGE DE MESES QUE JA EXISTEM FATURAS (LANÇAMENTOS DENTRO DE FATUAS)
          </p>
        </div>
      </div>
    </div>
  );
};
