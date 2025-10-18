import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { TransacaoInvestimentoSchema } from "@/app/schemas/investimentoSchema";
import {
  TypeInvestimento,
  TypeTransacaoInvestimento,
  TypeTransacaoInvestimentoInput,
} from "@/app/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormTransacaoInvestimentoProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (transacaoInvestimento: TypeTransacaoInvestimentoInput) => void;
  investimentoSelecionado?: TypeInvestimento;
  cancelar?: () => void;
  depositarOuSacar: string;
}

export const FormTransacaoInvestimentos = ({
  onSubmit,
  investimentoSelecionado,
  cancelar,
  depositarOuSacar,
}: FormTransacaoInvestimentoProps) => {
  const [formData, setFormData] = useState({
    investimentoId: investimentoSelecionado?.id,
    tipo:
      depositarOuSacar === "DEPOSITAR"
        ? ("DEPOSITO" as TypeTransacaoInvestimento["tipo"])
        : ("RETIRADA" as TypeTransacaoInvestimento["tipo"]),
    valor: "",
    descricao: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tipo:
        depositarOuSacar === "DEPOSITAR"
          ? ("DEPOSITO" as TypeTransacaoInvestimento["tipo"])
          : ("RETIRADA" as TypeTransacaoInvestimento["tipo"]),
    }));
  }, [depositarOuSacar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = TransacaoInvestimentoSchema.safeParse(formData);

    if (!result.success) {
      const mensagem = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      toast.error("Erro ao salvar transação!", {
        description:
          mensagem.join("\n") || "Preencha todos os campos corretamente.",
        className: "font-bold whitespace-pre-line", // 👈 respeita o \n
      });
      return;
    }

    onSubmit(result.data!);
    setFormData({
      investimentoId: investimentoSelecionado?.id,
      tipo: "DEPOSITO" as TypeTransacaoInvestimento["tipo"],
      valor: "",
      descricao: "",
    });
    cancelar?.();
    //console.log(formData) //consultar se esta chegando os dados corretamente
  };
  return (
    <Card className="space-y-4 bg-secondary/20 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="Tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: TypeTransacaoInvestimento["tipo"]) =>
                setFormData((prev) => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPOSITO">Depósito</SelectItem>
                <SelectItem value="RETIRADA">Retirada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="meta">Valor</Label>
            <Input
              id="valor"
              step="0.01"
              type="number"
              value={formData.valor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, valor: e.target.value }))
              }
              placeholder="0,00"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
            placeholder="motivo da transação"
          />
        </div>

        <div className="flex w-full gap-2">
          <Button
            onClick={cancelar}
            className="flex-1"
            variant={"outline"}
            type="button"
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" variant={"default"}>
            Confirmar
          </Button>
        </div>
      </form>
    </Card>
  );
};
