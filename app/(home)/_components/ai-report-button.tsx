import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

import { AlertCircle, BotIcon } from "lucide-react";

const AiReportButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="border font-bold">
          Relatório IA
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relatório IA</DialogTitle>
          <DialogDescription>
            Use Inteligência artificial para gerar relatorios com percepções em
            suas finanças
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center">
          <p className="animate-pulse text-2xl">
            <AlertCircle />
          </p>
          <p>Funcionalidade em desenvolvimento</p>
          <p>em breve disponível.</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button>Gerar Relatório</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
