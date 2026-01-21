import { Button } from "@/app/_components/ui/button";
import { CardContent } from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/_components/ui/dialog";

interface Props {
  titulo?: string;
  mensagem?: string;
  subtitulo?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClick?: () => void;
}

export const DialogConfirm = ({
  onClick,
  open,
  onOpenChange,
  subtitulo,
  titulo,
  mensagem,
}: Props) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>{titulo}</DialogHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="">
                <p>{mensagem}</p>
                <p className="pl-6 text-muted-foreground">{subtitulo}</p>
              </div>
              <div className="flex justify-between gap-6 px-6">
                <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
                  Cancelar
                </Button>
                <Button onClick={onClick}>Confirmar</Button>
              </div>
            </div>
          </CardContent>
        </DialogContent>
      </Dialog>
    </>
  );
};
