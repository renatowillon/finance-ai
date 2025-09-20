import { Loader2 } from "lucide-react";
import { Card } from "./ui/card";

export const Loading = () => {
  return (
    <>
      <Card className="flex flex-col items-center justify-center gap-2 bg-secondary/25 p-10">
        <p className="flex gap-2 text-xl font-semibold">
          <Loader2 className="animate-spin duration-1000" /> Carregando
        </p>
      </Card>
    </>
  );
};
