"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import React, { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  Check,
  CheckCheck,
  CreditCard,
  Filter,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  WalletIcon,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "./calendar";
import { ptBR } from "date-fns/locale";
import SumaryCard from "@/app/(home)/_components/summary-card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<
  TData extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    amount: any;
    type: string;
    date: string | number | Date;
    id: string | number;
  },
  TValue,
>({ columns, data }: DataTableProps<TData, TValue>) {
  // const hoje = new Date();
  const [isMobile, setIsMobile] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroPago, setFiltroPago] = useState("");
  // const [filtroData, setFiltroData] = useState(String(hoje.getMonth() + 1));
  const [dateInicio, setDateInicio] = useState<Date>(startOfMonth(new Date()));
  const [dateFim, setDateFim] = useState<Date>(endOfMonth(new Date()));
  const [openCalendarioInicio, setOpenCalendarioInicio] = useState(false);
  const [openCalendarioFim, setOpenCalendarioFim] = useState(false);

  const { dadosFiltrados, totais } = useMemo(() => {
    const filtrado = data.filter((item) => {
      const tipoOk =
        !filtroTipo || filtroTipo === "TODOS"
          ? true
          : "type" in item && item.type === filtroTipo;

      const pagoOk =
        !filtroPago || filtroPago === "TODOS"
          ? true
          : "baixado" in item &&
            (filtroPago === "true"
              ? item.baixado === true
              : item.baixado === false);

      const dataItem = format(new Date(item.date), "yyyy-MM-dd");
      const dataI = format(dateInicio, "yyyy-MM-dd");
      const dataF = format(dateFim, "yyyy-MM-dd");

      const dataDentroDoPeriodo = dataItem >= dataI && dataItem <= dataF;

      return tipoOk && pagoOk && dataDentroDoPeriodo;
    });

    const totais = filtrado.reduce(
      (acc, item) => {
        if (item.type === "DESPESA") acc.despesas += Number(item.amount) ?? 0;
        else if (item.type === "DEPOSITO")
          acc.receitas += Number(item.amount) ?? 0;
        else if (item.type === "INVESTIMENTO")
          acc.investimentos += Number(item.amount) ?? 0;
        else if (item.type === "CARTAOCREDITO")
          acc.despesas += Number(item.amount) ?? 0;
        return acc;
      },
      { despesas: 0, receitas: 0, investimentos: 0 },
    );

    return { dadosFiltrados: filtrado, totais };
  }, [data, filtroTipo, filtroPago, dateInicio, dateFim]);

  const table = useReactTable({
    data: dadosFiltrados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowId: (row: any) => row.id,
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // const transacao: Transaction = table.

  // Renderização para Mobile (Cards)
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* filtros de pesquisas */}

        <div
          title="Filtro em estado de implementação"
          className="flex-row items-center justify-evenly gap-3 space-y-3 rounded-md border bg-muted/50 p-3 text-muted"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filtro">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter size={20} />
                  Filtros{" "}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 p-1">
                <div className="flex w-full flex-col md:w-1/4">
                  <span className="mb-1 text-xs font-bold text-gray-500">
                    Tipo de conta
                  </span>

                  <div className="flex items-center gap-2">
                    <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                      <SelectTrigger className="w-full bg-muted/50 text-muted-foreground">
                        <SelectValue placeholder="Tipo de conta" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-muted-foreground">
                            Tipo de conta
                          </SelectLabel>
                          <SelectItem value="TODOS">
                            <span className="flex gap-2">
                              <Banknote size={20} />
                              Todos
                            </span>
                          </SelectItem>
                          <SelectItem value="DEPOSITO">
                            <span className="flex gap-2">
                              <TrendingUp size={20} /> Depósitos
                            </span>
                          </SelectItem>
                          <SelectItem value="DESPESA">
                            <span className="flex gap-2">
                              <TrendingDown size={20} /> Despesas
                            </span>
                          </SelectItem>
                          <SelectItem value="CARTAOCREDITO">
                            <span className="flex gap-2">
                              <CreditCard size={20} /> Cartão
                            </span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex w-full flex-col md:w-1/4">
                  <span className="mb-1 text-xs font-bold text-gray-500">
                    Status da conta
                  </span>

                  <div className="flex items-center gap-2">
                    <Select value={filtroPago} onValueChange={setFiltroPago}>
                      <SelectTrigger className="w-full bg-muted/50 text-muted-foreground">
                        <SelectValue placeholder="Status da conta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-muted-foreground">
                            Status da conta
                          </SelectLabel>
                          <SelectItem value="TODOS">
                            <span className="flex gap-2">
                              <CheckCheck size={20} /> Todos
                            </span>
                          </SelectItem>
                          <SelectItem value="true">
                            <span className="flex gap-2">
                              <Check size={20} /> Pago
                            </span>
                          </SelectItem>
                          <SelectItem value="false">
                            <span className="flex gap-2">
                              <X size={20} /> Pendente
                            </span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex w-full flex-col md:w-1/4">
                  <span className="mb-1 text-xs font-bold text-gray-500">
                    Data Inicio
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Popover do calendário */}
                    <Popover
                      open={openCalendarioInicio}
                      onOpenChange={setOpenCalendarioInicio}
                    >
                      <PopoverTrigger asChild className="w-full">
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-center gap-2 text-gray-600"
                        >
                          <CalendarDays className="h-4 w-4" />
                          {format(dateInicio, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="z-[9999] w-auto overflow-hidden p-2"
                        align="end"
                      >
                        <Calendar
                          locale={ptBR}
                          mode="single"
                          selected={dateInicio}
                          captionLayout="dropdown"
                          onSelect={(d) => {
                            if (d) {
                              setDateInicio(d);
                              setOpenCalendarioInicio(false);
                            }
                          }}
                          className="rounded-md border shadow-sm"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex w-full flex-col md:w-1/4">
                  <span className="mb-1 text-xs font-bold text-gray-500">
                    Data Fim
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Popover do calendário */}
                    <Popover
                      open={openCalendarioFim}
                      onOpenChange={setOpenCalendarioFim}
                    >
                      <PopoverTrigger asChild className="w-full">
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-center gap-2 text-gray-600"
                        >
                          <CalendarDays className="h-4 w-4" />
                          {format(dateFim, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="z-[9999] w-auto overflow-hidden p-2"
                        align="end"
                      >
                        <Calendar
                          locale={ptBR}
                          mode="single"
                          selected={dateFim}
                          captionLayout="dropdown"
                          onSelect={(d) => {
                            if (d) {
                              setDateFim(d);
                              setOpenCalendarioFim(false);
                            }
                          }}
                          className="rounded-md border shadow-sm"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SumaryCard
            className="justify-between space-y-1 p-1 text-sm"
            title="Receitas"
            icon={
              <TrendingUp
                size={16}
                className="text-end text-green-500 md:text-start"
              />
            }
            amount={totais.receitas}
            size="small"
          />

          <SumaryCard
            className="justify-between space-y-1 p-1 text-sm"
            title="Despesas"
            icon={
              <TrendingDown
                size={16}
                className="text-end text-red-500 md:text-start"
              />
            }
            amount={totais.despesas}
            size="small"
          />

          <SumaryCard
            className="col-span-2 justify-between space-y-1 p-1 text-sm"
            title="Balanço período"
            icon={
              <WalletIcon
                size={16}
                className="text-end text-primary md:text-start"
              />
            }
            amount={totais.receitas - totais.despesas}
            size="small"
          />

          {/* <SumaryCard
            className="justify-between space-y-1 p-4"
            title="Investimentos"
            icon={
              <PiggyBank
                size={16}
                className="text-primary-500 text-end md:text-start"
              />
            }
            amount={totais.investimentos}
            size="small"
          /> */}
        </div>
        {data.length > 0 ? (
          data.map((item, index) => {
            const cells = table.getRowModel().rows[index]?.getVisibleCells();

            if (!cells) return null;

            return (
              <div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key={(item as any).id}
                className="rounded-lg border bg-azulMuted p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex-1 space-y-2 pr-4">
                    <div className="text-base font-semibold leading-tight text-foreground">
                      {/* descrição */}
                      {flexRender(
                        cells[0]?.column.columnDef.cell,
                        cells[0]?.getContext(),
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground">
                        {/* tipo de transação */}
                        {flexRender(
                          cells[1]?.column.columnDef.cell,
                          cells[1]?.getContext(),
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex items-center justify-center gap-2">
                      <div>
                        {/* baixado */}
                        {flexRender(
                          cells[7]?.column.columnDef.cell,
                          cells[7]?.getContext(),
                        )}
                      </div>
                      <div className="text-base font-bold text-foreground">
                        {/* Categoria */}
                        {flexRender(
                          cells[2]?.column.columnDef.cell,
                          cells[2]?.getContext(),
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-end space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {/* banco */}
                        {flexRender(
                          cells[3]?.column.columnDef.cell,
                          cells[3]?.getContext(),
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {/* data */}
                        {flexRender(
                          cells[4]?.column.columnDef.cell,
                          cells[4]?.getContext(),
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botões centralizados abaixo */}
                <div className="flex items-center justify-center space-x-3 border-t border-border/30 pt-2">
                  {/* Botão Editar */}
                  {cells[5] && (
                    <div className="text-center">
                      {/* valor */}
                      {flexRender(
                        cells[5]?.column.columnDef.cell,
                        cells[5]?.getContext(),
                      )}
                    </div>
                  )}
                  {/* Botão Excluir */}
                  {cells[6] && (
                    <div className="text-center">
                      {/* ações */}
                      {flexRender(
                        cells[6]?.column.columnDef.cell,
                        cells[6]?.getContext(),
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border bg-muted/30 p-6 shadow-lg">
            <div className="text-center text-muted-foreground">
              Sem Resultados.
            </div>
          </div>
        )}
      </div>
    );
  }

  // Renderização para Desktop (Tabela Original)

  return (
    <div className="space-y-6">
      {/* filtros de pesquisas */}
      <div
        title="Filtro em estado de implementação"
        className="flex items-center gap-3 rounded-md border bg-muted/50 p-3 text-muted"
      >
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter size={20} />
          Filtros:{" "}
        </span>
        <div className="flex gap-3 text-muted">
          <div className="flex w-full flex-col md:w-1/4">
            <span className="mb-1 text-xs font-bold text-gray-500">
              Tipo de conta
            </span>
            <div className="flex items-center gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[180px] bg-muted/50 text-muted-foreground">
                  <SelectValue placeholder="Tipo de conta" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-muted-foreground">
                      Tipo de conta
                    </SelectLabel>
                    <SelectItem value="TODOS">
                      <span className="flex gap-2">
                        <Banknote size={20} />
                        Todos
                      </span>
                    </SelectItem>
                    <SelectItem value="DEPOSITO">
                      <span className="flex gap-2">
                        <TrendingUp size={20} /> Depósitos
                      </span>
                    </SelectItem>
                    <SelectItem value="DESPESA">
                      <span className="flex gap-2">
                        <TrendingDown size={20} /> Despesas
                      </span>
                    </SelectItem>
                    <SelectItem value="CARTAOCREDITO">
                      <span className="flex gap-2">
                        <CreditCard size={20} /> Cartão
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-full flex-col md:w-1/4">
            <span className="mb-1 text-xs font-bold text-gray-500">
              Status da conta
            </span>
            <div className="flex items-center gap-2">
              <Select value={filtroPago} onValueChange={setFiltroPago}>
                <SelectTrigger className="w-[180px] bg-muted/50 text-muted-foreground">
                  <SelectValue placeholder="Status da conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-muted-foreground">
                      Status da conta
                    </SelectLabel>
                    <SelectItem value="TODOS">
                      <span className="flex gap-2">
                        <CheckCheck size={20} /> Todos
                      </span>
                    </SelectItem>
                    <SelectItem value="true">
                      <span className="flex gap-2">
                        <Check size={20} /> Pago
                      </span>
                    </SelectItem>
                    <SelectItem value="false">
                      <span className="flex gap-2">
                        <X size={20} /> Pendente
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-full flex-col md:w-1/4">
            <span className="mb-1 text-xs font-bold text-gray-500">
              Data Inicio
            </span>
            <div className="flex items-center gap-2">
              {/* Popover do calendário */}
              <Popover
                open={openCalendarioInicio}
                onOpenChange={setOpenCalendarioInicio}
              >
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2 text-gray-600"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {format(dateInicio, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="z-[9999] w-auto overflow-hidden p-2"
                  align="end"
                >
                  <Calendar
                    locale={ptBR}
                    mode="single"
                    selected={dateInicio}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      if (d) {
                        setDateInicio(d);
                        setOpenCalendarioInicio(false);
                      }
                    }}
                    className="rounded-md border shadow-sm"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex w-full flex-col md:w-1/4">
            <span className="mb-1 text-xs font-bold text-gray-500">
              Data Fim
            </span>
            <div className="flex items-center gap-2">
              {/* Popover do calendário */}
              <Popover
                open={openCalendarioFim}
                onOpenChange={setOpenCalendarioFim}
              >
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2 text-gray-600"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {format(dateFim, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="z-[9999] w-auto overflow-hidden p-2"
                  align="end"
                >
                  <Calendar
                    locale={ptBR}
                    mode="single"
                    selected={dateFim}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      if (d) {
                        setDateFim(d);
                        setOpenCalendarioFim(false);
                      }
                    }}
                    className="rounded-md border shadow-sm"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <SumaryCard
          className="w-full"
          title="Receitas"
          icon={
            <TrendingUp
              size={16}
              className="text-end text-green-500 md:text-start"
            />
          }
          amount={totais.receitas}
          size="small"
        />

        <SumaryCard
          className="w-full"
          title="Despesas"
          icon={
            <TrendingDown
              size={16}
              className="text-end text-red-500 md:text-start"
            />
          }
          amount={totais.despesas}
          size="small"
        />
        <SumaryCard
          className="w-full"
          title="Balanço período"
          icon={
            <WalletIcon
              size={16}
              className="text-end text-primary md:text-start"
            />
          }
          amount={totais.receitas - totais.despesas}
          size="small"
        />

        <SumaryCard
          className="w-full"
          title="Investimentos"
          icon={
            <PiggyBank
              size={16}
              className="text-primary-500 text-end md:text-start"
            />
          }
          amount={totais.investimentos}
          size="small"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem Resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
