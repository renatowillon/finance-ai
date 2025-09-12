"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { PorcentagemTransacaoPorTipo } from "@/app/_data/get-dashboard/types";
import { PiggyBankIcon, TrendingDown, TrendingUp } from "lucide-react";
import { PercentageItem } from "./percentage-items";

const configuracaoGrafico = {
  [TransactionType.INVESTIMENTO]: {
    label: "Investido",
    color: "#ffffff",
  },
  [TransactionType.DEPOSITO]: {
    label: "Receita",
    color: "#55b02e",
  },
  [TransactionType.DESPESA]: {
    label: "Despesa",
    color: "#e93030",
  },
} satisfies ChartConfig;

interface PropriedadesGraficoPizzaTransacoes {
  porcentagemPorTipo: PorcentagemTransacaoPorTipo;
  totalDepositos: number;
  totalInvestimentos: number;
  totalDespesas: number;
}

const TransactionsPieChats = ({
  totalDepositos,
  totalDespesas,
  totalInvestimentos,
  porcentagemPorTipo,
}: PropriedadesGraficoPizzaTransacoes) => {
  const dadosGrafico = [
    {
      type: TransactionType.INVESTIMENTO,
      amount: totalInvestimentos,
      fill: "#ffffff",
    },
    {
      type: TransactionType.DEPOSITO,
      amount: totalDepositos,
      fill: "#55b02e",
    },
    {
      type: TransactionType.DESPESA,
      amount: totalDespesas,
      fill: "#e93030",
    },
  ];
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <ChartContainer
          config={configuracaoGrafico}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dadosGrafico}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
        <div className="space-y-2">
          <PercentageItem
            icon={<TrendingUp size={16} className="text-primary" />}
            title="Receita"
            value={porcentagemPorTipo[TransactionType.DEPOSITO]}
          />
          <PercentageItem
            icon={<TrendingDown size={16} className="text-red-500" />}
            title="Despesa"
            value={porcentagemPorTipo[TransactionType.DESPESA]}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} className="text-white" />}
            title="Investimento"
            value={porcentagemPorTipo[TransactionType.INVESTIMENTO]}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default TransactionsPieChats;
