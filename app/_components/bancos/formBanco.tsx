import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TypeBanco } from "@/app/types";
import { CorBanco } from "@/app/models";

interface FormBancoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (banco: Omit<TypeBanco, "id" | "saldoAtual">) => void;
  bancoSelecionado?: TypeBanco;
}

export const Formbanco = ({
  open,
  onOpenChange,
  onSubmit,
  bancoSelecionado,
}: FormBancoProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "POUPANCA" as TypeBanco["tipo"],
    saldoInicial: "",
    cor: CorBanco[0],
  });

  useEffect(() => {
    if (open) {
      if (bancoSelecionado) {
        // Editar: preenche com os dados
        setFormData({
          nome: bancoSelecionado.nome,
          tipo: bancoSelecionado.tipo,
          saldoInicial: String(bancoSelecionado.saldoInicial),
          cor: bancoSelecionado.cor,
        });
      } else {
        // Criar: limpa o formulário
        setFormData({
          nome: "",
          tipo: "POUPANCA",
          saldoInicial: "",
          cor: CorBanco[0],
        });
      }
    }
  }, [open, bancoSelecionado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.saldoInicial) return;

    onSubmit({
      nome: formData.nome,
      tipo: formData.tipo,
      saldoInicial: parseFloat(formData.saldoInicial),
      cor: formData.cor,
    });
    setFormData({
      nome: "",
      tipo: "POUPANCA" as TypeBanco["tipo"],
      saldoInicial: "",
      cor: CorBanco[0],
    });
    onOpenChange(false);
  };
  console.log("Banco Selecionado", bancoSelecionado);
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bancoSelecionado ? "Atualizar Banco" : "Adicionar Novo Banco"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Banco</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Banco do Brasil"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TypeBanco["tipo"]) =>
                  setFormData((prev) => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POUPANCA">Conta Poupança</SelectItem>
                  <SelectItem value="CONTA_CORRENTE">Conta Corrente</SelectItem>
                  <SelectItem value="CARTAO_CREDITO">
                    Cartão de Crédito
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="saldoInicial">Saldo Inicial (R$)</Label>
              <Input
                id="saldoInicial"
                value={formData.saldoInicial}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    saldoInicial: e.target.value,
                  }))
                }
                step="0.01"
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <div className="flex flex-wrap gap-2">
                {CorBanco.map((cor) => (
                  <Button
                    key={cor}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 transition-all first-letter:${
                      formData.cor === cor
                        ? "scale-110 border-primary"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: cor }}
                    onClick={() => setFormData((prev) => ({ ...prev, cor }))}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {bancoSelecionado ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
