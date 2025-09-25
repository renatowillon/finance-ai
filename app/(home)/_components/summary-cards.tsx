import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SumaryCard from "./summary-card";
import { CardBancosDashboard } from "@/app/_components/bancos/cardBancosDashboard";

interface PropriedadesResumo {
  month: string;
  saldo: number;
  totalDepositos: number;
  totalInvestimentos: number;
  totalDespesas: number;
  userCanAddTransaction?: boolean;
}

const SumaryCards = async ({
  saldo,
  totalDepositos,
  totalDespesas,
  totalInvestimentos,
  userCanAddTransaction,
}: PropriedadesResumo) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Card de Saldo - sempre ocupa toda largura */}
      <CardBancosDashboard />
      <div>
        <SumaryCard
          icon={<WalletIcon size={16} />}
          title="Saldo mensal"
          amount={saldo}
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
              amount={totalDepositos}
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
              amount={totalDespesas}
              size="small"
            />
          </div>
        </div>

        {/* Mobile: Investimentos ocupa toda largura / Desktop: primeira coluna */}
        <div className="sm:order-1">
          <SumaryCard
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            amount={totalInvestimentos}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default SumaryCards;
