import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SumaryCard from "./summary-card";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

interface SumaryProps {
  month: string;
  balance: number;
  depositTotal: number;
  investimentsTotal: number;
  expensesTotal: number;
}

const SumaryCards = async ({
  balance,
  depositTotal,
  expensesTotal,
  investimentsTotal,
}: SumaryProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

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
