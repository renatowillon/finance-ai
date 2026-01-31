import { MoneyInput } from "@/app/_components/money-input";
import { Button } from "@/app/_components/ui/button";
import { DatePicker } from "@/app/_components/ui/date-piker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Switch } from "@/app/_components/ui/switch";
import { parseMoney } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { pegarCartoes } from "@/app/fetche/cartaoFetch";
import { TransacaoCartaoSchama } from "@/app/schemas/transacaoCartaoSchema";
import {
  TypeCartaoCredito,
  TypeTransacaoCartao,
  TypeTransacaoCartaoInput,
} from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Plus, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mostrarBotao?: boolean;
  onSubmit?: (transacaoCartao: TypeTransacaoCartaoInput) => void;
  transacaoSelecionada?: TypeTransacaoCartao;
}

export const AddTransacaoCartao = ({
  open,
  onOpenChange,
  mostrarBotao,
  onSubmit,
  transacaoSelecionada,
}: Props) => {
  // const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<TypeTransacaoCartaoInput>({
    descricao: "",
    valor: "",
    dataCompra: new Date(),
    parcelada: false,
    parcelaAtual: 0,
    totalParcelas: 0,
    competencia: new Date(),
    pago: false,
    dataPagamento: new Date(),
    cartaoCreditoId: "",
  });
  const { data: cartao } = useQuery({
    queryKey: ["cartaoCredito"],
    queryFn: pegarCartoes,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = TransacaoCartaoSchama.safeParse(formData);
    if (!result.success) {
      const mensagem = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);
      toast.error("Erro ao salvar transação", {
        description:
          mensagem.join("\n") || "Preencha todos os campos corretamente.",
        className: "font-bold whitespace-pre-line",
      });
      return;
    }
    if (onSubmit) {
      onSubmit(result.data!);
    }

    resetForm();

    console.log(formData);
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      descricao: "",
      valor: "",
      dataCompra: new Date(),
      parcelada: false,
      parcelaAtual: 0,
      totalParcelas: 0,
      competencia: new Date(),
      pago: false,
      dataPagamento: new Date(),
      cartaoCreditoId: "",
    });
  };

  useEffect(() => {
    if (open) {
      if (transacaoSelecionada) {
        setFormData({
          descricao: transacaoSelecionada.descricao,
          valor: transacaoSelecionada.valor,
          dataCompra: transacaoSelecionada.dataCompra,
          parcelada: transacaoSelecionada.parcelada,
          parcelaAtual: transacaoSelecionada.parcelaAtual,
          totalParcelas: transacaoSelecionada.totalParcelas,
          competencia: transacaoSelecionada.competencia,
          pago: transacaoSelecionada.pago,
          dataPagamento: transacaoSelecionada.dataPagamento,
          cartaoCreditoId: transacaoSelecionada.cartaoCreditoId,
        });
      } else {
        setFormData({
          descricao: "",
          valor: "",
          dataCompra: new Date(),
          parcelada: false,
          parcelaAtual: 0,
          totalParcelas: 0,
          competencia: new Date(),
          pago: false,
          dataPagamento: new Date(),
          cartaoCreditoId: "",
        });
      }
    }
  }, [open, transacaoSelecionada]);

  return (
    <>
      {mostrarBotao && (
        <div>
          <Button
            onClick={() => {
              onOpenChange(!open);
            }}
            className="hidden rounded-full lg:flex"
          >
            <Plus /> Adicionar Transação
          </Button>
          <Button
            onClick={() => onOpenChange(!open)}
            className="flex items-center rounded-full lg:hidden"
          >
            <Plus />
            <CreditCard className="" />
          </Button>
        </div>
      )}
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogPortal>
          <div className="fixed inset-0 bg-black/70 transition-opacity duration-500" />
          <DialogContent
            className="max-h-[90vh] max-w-2xl"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {transacaoSelecionada
                  ? "Atualizar transação cartão"
                  : "Adicionar transação cartão"}
              </DialogTitle>
            </DialogHeader>
            <div>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="space-y-1">
                  <Label>Descrição</Label>
                  <Input
                    id="descricao"
                    placeholder="Compra com mercado"
                    value={formData.descricao}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Valor</Label>
                  <MoneyInput
                    value={formData.valor}
                    placeholder="Digite o valor"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }));
                    }}
                    // onBlur={() => consoleteste(formData)}
                    // onValueChange={({ floatValue }) => {
                    //   field.onChange(floatValue);
                    // }}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Cartão</Label>
                  <Select
                    value={formData.cartaoCreditoId}
                    onValueChange={(valor) => {
                      setFormData((prev) => ({
                        ...prev,
                        cartaoCreditoId: String(valor),
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cartão"></SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {cartao?.map((c: TypeCartaoCredito) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome} - {formatCurrency(c.limite)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Data da Compra</Label>
                  <DatePicker
                    value={formData.dataCompra as Date}
                    onChange={(date) => {
                      if (!date) return;

                      setFormData((prev) => ({
                        ...prev,
                        dataCompra: date,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 space-y-1 pt-1">
                  <Label className="flex items-center gap-2">
                    <RefreshCcw size={20} />
                    <p>Pacelada</p>
                  </Label>
                  <Switch
                    id="repete"
                    checked={formData.parcelada}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        parcelada: checked,
                        totalParcelas: checked ? prev.totalParcelas : 1,
                        parcelaAtual: checked ? prev.parcelaAtual : 1,
                      }));
                    }}
                  />
                </div>
                {formData.parcelada && (
                  <div className="space-y-1">
                    <Label>Número de Parcelas</Label>
                    <Select
                      value={
                        formData.totalParcelas
                          ? String(formData.totalParcelas)
                          : undefined
                      }
                      onValueChange={(valor) => {
                        setFormData((prev) => ({
                          ...prev,
                          totalParcelas: Number(valor),
                          parcelaAtual: 1,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o número de parcelas" />
                      </SelectTrigger>

                      <SelectContent>
                        {Array.from({ length: 17 }, (_, i) => {
                          const parcelas = i + 2;
                          const valorTotal = parseMoney(formData.valor);

                          if (!valorTotal || valorTotal <= 0) return null;

                          const valorParcela = valorTotal / parcelas;

                          return (
                            <SelectItem key={parcelas} value={String(parcelas)}>
                              {parcelas}x de {formatCurrency(valorParcela)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center justify-end gap-3">
                  <DialogClose asChild>
                    <Button
                      type="reset"
                      onClick={resetForm}
                      variant={"outline"}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {transacaoSelecionada ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
