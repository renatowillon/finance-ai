import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  OPCOES_METODOS_PAGAMENTO_TRANSACAO,
  OPCOES_TIPOS_TRANSACAO,
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-piker";
import { z } from "zod";
import { TransactionPaymentMethods, TransactionType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { inserirOuAtualizarTransacao } from "../_actions/upsert-transaction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBanco } from "../fetche/bancoFetch";
import { TypeBanco, TypeCategoria } from "../types";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { fetchCategoria } from "../fetche/categoriaFetch";
import { useEffect } from "react";

interface PropriedadesDialogoInserirOuAtualizarTransacao {
  estaAberto: boolean;
  definirSeEstaAberto: (estaAberto: boolean) => void;
  idTransacao?: string;
  valoresPadrao?: EsquemaFormulario;
}

const esquemaFormulario = z.object({
  nome: z.string().trim().min(1, { message: "O nome é obrigatório" }),
  valor: z.number({ required_error: "valor é obrigatório" }).positive({
    message: "O valor deve ser positivo",
  }),
  tipo: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório",
  }),
  categoriaId: z
    .number({
      required_error: "A categoria é obrigatória",
    })
    .min(1, { message: "A categoria é obrigatória" }),
  metodoPagamento: z.nativeEnum(TransactionPaymentMethods, {
    required_error: "O método de pagamento é obrigatório",
  }),
  data: z.date({ required_error: "A data é obrigatória" }),
  bancoId: z.number({ required_error: "Banco é Obrigatorio" }),
  baixado: z.boolean(),
});

type EsquemaFormulario = z.infer<typeof esquemaFormulario>;

const DialogoInserirOuAtualizarTransacao = ({
  estaAberto,
  definirSeEstaAberto,
  idTransacao,
  valoresPadrao,
}: PropriedadesDialogoInserirOuAtualizarTransacao) => {
  const { data: bancos } = useQuery({
    queryKey: ["bancos"],
    queryFn: fetchBanco,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategoria,
    staleTime: 5 * (60 * 1000),
  });

  const formulario = useForm<EsquemaFormulario>({
    resolver: zodResolver(esquemaFormulario),

    defaultValues: valoresPadrao
      ? {
          ...valoresPadrao,
          data: valoresPadrao ? new Date(valoresPadrao.data) : new Date(),
        }
      : {
          nome: "",
          valor: 0,
          categoriaId: 0,
          tipo: "DEPOSITO",
          metodoPagamento: "DINHEIRO",
          data: new Date(),
          baixado: false,
        },
  });

  const queryCliente = useQueryClient();
  const aoEnviar = async (dados: EsquemaFormulario) => {
    try {
      await inserirOuAtualizarTransacao({ ...dados, id: idTransacao });
      definirSeEstaAberto(false);
      formulario.reset();
      queryCliente.invalidateQueries({
        queryKey: ["saldo"],
      });
    } catch (erro) {
      console.error(erro);
    }
  };

  const eAtualizacao = Boolean(idTransacao);

  const tipoSelecionado = useWatch({
    control: formulario.control,
    name: "tipo",
  });

  const categoriasFiltradas = (categorias || []).filter(
    (cat: TypeCategoria) => {
      if (!tipoSelecionado) return true;
      if (tipoSelecionado === "DESPESA") return cat.tipo === "DESPESA";
      if (tipoSelecionado === "INVESTIMENTO") return cat.tipo === "DESPESA";
      if (tipoSelecionado === "DEPOSITO") return cat.tipo === "DEPOSITO";
    },
  );

  useEffect(() => {
    if (!eAtualizacao) {
      if (
        !categoriasFiltradas.find(
          (c: { id: number }) => c.id === formulario.getValues("categoriaId"),
        )
      ) {
        const primeira = categoriasFiltradas[0];
        formulario.setValue("categoriaId", primeira ? Number(primeira.id) : 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoSelecionado]);
  return (
    <Dialog
      open={estaAberto}
      onOpenChange={(aberto) => {
        definirSeEstaAberto(aberto);
        if (!aberto) {
          formulario.reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {eAtualizacao ? "Atualizar" : "Criar"} transação
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...formulario}>
          <form
            onSubmit={formulario.handleSubmit(aoEnviar)}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-4">
              <FormField
                control={formulario.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="flex-1 gap-4">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a descrição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formulario.control}
                name="baixado"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center gap-2 pt-7">
                        <Label htmlFor="baixado">Pago</Label>
                        <Switch
                          id="baixado"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formulario.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      value={field.value}
                      placeholder="Digite o valor"
                      onValueChange={({ floatValue }) => {
                        field.onChange(floatValue);
                      }}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formulario.control}
              name="bancoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolha o Banco</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o banco"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bancos?.map((bancos: TypeBanco) => (
                        <SelectItem key={bancos.id} value={String(bancos.id)}>
                          {bancos.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-center gap-4">
              <FormField
                control={formulario.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OPCOES_TIPOS_TRANSACAO.map((opcoes) => (
                          <SelectItem key={opcoes.value} value={opcoes.value}>
                            {opcoes.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formulario.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                      // defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriasFiltradas.map((opcoes: TypeCategoria) => (
                          <SelectItem key={opcoes.id} value={String(opcoes.id)}>
                            {opcoes.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formulario.control}
              name="metodoPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método de pagamento"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OPCOES_METODOS_PAGAMENTO_TRANSACAO.map((opcoes) => (
                        <SelectItem key={opcoes.value} value={opcoes.value}>
                          {opcoes.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formulario.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                {eAtualizacao ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default DialogoInserirOuAtualizarTransacao;
