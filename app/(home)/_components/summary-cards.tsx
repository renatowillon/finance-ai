import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SumaryCard from "./summary-card";
import { db } from "@/app/_lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

interface SumaryProps {
  month: string;
}

const SumaryCards = async ({ month }: SumaryProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const where = {
    userId,
    date: {
      gte: new Date(`2025-${month}-01`),
      lt: new Date(`2025-${month}-31`),
    },
  };
  const depositTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSITO" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const investimentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTIMENTO" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DESPESA" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const balance = depositTotal - investimentsTotal - expensesTotal;
  return (
    <div className="space-y-6">
      <div>
        <SumaryCard
          icon={<WalletIcon size={16} />}
          title="Saldo"
          amount={balance}
          size="large"
        />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <SumaryCard
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            amount={investimentsTotal}
            size="small"
          />
        </div>
        <div>
          <SumaryCard
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receitas"
            amount={depositTotal}
            size="small"
          />
        </div>
        <div>
          <SumaryCard
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            amount={expensesTotal}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};
export default SumaryCards;
