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
import { TransactionPercentagePerType } from "@/app/_data/_get-dashboard/types";
import { PiggyBankIcon, TrendingDown, TrendingUp } from "lucide-react";
import { PercentageItem } from "./percentage-items";

const chartConfig = {
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

interface TransactionsPieChatsProps {
  typesPercentage: TransactionPercentagePerType;
  depositTotal: number;
  investimentsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChats = ({
  depositTotal,
  expensesTotal,
  investimentsTotal,
  typesPercentage,
}: TransactionsPieChatsProps) => {
  const chartData = [
    {
      type: TransactionType.INVESTIMENTO,
      amount: investimentsTotal,
      fill: "#ffffff",
    },
    {
      type: TransactionType.DEPOSITO,
      amount: depositTotal,
      fill: "#55b02e",
    },
    {
      type: TransactionType.DESPESA,
      amount: expensesTotal,
      fill: "#e93030",
    },
  ];
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
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
            value={typesPercentage[TransactionType.DEPOSITO]}
          />
          <PercentageItem
            icon={<TrendingDown size={16} className="text-red-500" />}
            title="Despesa"
            value={typesPercentage[TransactionType.DESPESA]}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} className="text-white" />}
            title="Investimento"
            value={typesPercentage[TransactionType.INVESTIMENTO]}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default TransactionsPieChats;
