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
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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
                key={index}
                className="rounded-lg border bg-muted/30 p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  {/* Lado esquerdo - Título e Badge (categoria) */}
                  <div className="flex-1 pr-4">
                    <div className="text-base font-semibold leading-tight text-foreground">
                      {/* Título/Descrição */}
                      {flexRender(
                        cells[0]?.column.columnDef.cell,
                        cells[0]?.getContext(),
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground">
                        {/* Badge/Categoria onde antes estava o banco */}
                        {flexRender(
                          cells[1]?.column.columnDef.cell,
                          cells[1]?.getContext(),
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Lado direito - Valor e data com badge */}
                  <div className="text-right">
                    <div className="text-base font-bold text-foreground">
                      {/* Valor onde antes estava o banco */}
                      {flexRender(
                        cells[2]?.column.columnDef.cell,
                        cells[2]?.getContext(),
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-end space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {/* Data */}
                        {flexRender(
                          cells[3]?.column.columnDef.cell,
                          cells[3]?.getContext(),
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {/* Badge ao lado da data */}
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
                      {flexRender(
                        cells[5]?.column.columnDef.cell,
                        cells[5]?.getContext(),
                      )}
                    </div>
                  )}
                  {/* Botão Excluir */}
                  {cells[6] && (
                    <div className="text-center">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem Resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
