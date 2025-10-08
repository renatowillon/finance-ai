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
import { useEffect, useState } from "react";
import {
  Banknote,
  Check,
  CheckCheck,
  Filter,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "./select";
import { SelectValue } from "@radix-ui/react-select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [isMobile, setIsMobile] = useState(false);

  const table = useReactTable({
    data,
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
  const [filtroTipo, setFiltroTipo] = useState("");
  const [FiltroPago, setFiltroPago] = useState("");
  // Renderização para Mobile (Cards)
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => {
            const cells = table.getRowModel().rows[index]?.getVisibleCells();

            if (!cells) return null;

            return (
              <div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key={(item as any).id}
                className="rounded-lg border bg-muted/30 p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
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
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={FiltroPago} onValueChange={setFiltroPago}>
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
