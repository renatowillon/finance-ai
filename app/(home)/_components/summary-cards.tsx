import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SumaryCard from "./summary-card";

interface SumaryProps {
  month: string;
  balance: number;
  depositTotal: number;
  investimentsTotal: number;
  expensesTotal: number;
  userCanAddTransaction?: boolean;
}

const SumaryCards = async ({
  balance,
  depositTotal,
  expensesTotal,
  investimentsTotal,
  userCanAddTransaction,
}: SumaryProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Card de Saldo - sempre ocupa toda largura */}
      <div>
        <SumaryCard
          icon={<WalletIcon size={16} />}
          title="Saldo"
          amount={balance}
          size="large"
          userCanAddTransaction={userCanAddTransaction}
        />
      </div>

      {/* Cards pequenos com layout responsivo */}
      <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0">
        {/* Mobile: Receitas e Despesas lado a lado */}
        <div className="grid grid-cols-2 gap-4 sm:contents">
          <div className="sm:order-2">
            <SumaryCard
              icon={<TrendingUpIcon size={16} className="text-primary" />}
              title="Receitas"
              amount={depositTotal}
              size="small"
            />
          </div>
          <div className="sm:order-3">
            <SumaryCard
              icon={
                <TrendingDownIcon
                  size={16}
                  className="text-end text-red-500 md:text-start"
                />
              }
              title="Despesas"
              amount={expensesTotal}
              size="small"
            />
          </div>
        </div>

        {/* Mobile: Investimentos ocupa toda largura / Desktop: primeira coluna */}
        <div className="sm:order-1">
          <SumaryCard
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            amount={investimentsTotal}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default SumaryCards;
