import { redirect } from "next/navigation";
import SumaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-selects";
import { isMatch } from "date-fns";
import TransactionsPieChats from "./_components/transaction-pie-charts";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";
import { cookies } from "next/headers";
import { pegarUsuarioToken } from "../_lib/session";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }
  const user = await pegarUsuarioToken(token!);
  if (!user) {
    redirect("/login");
  }
  console.log("Usuario Logado: ", user.userId, user.email);

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`/?month=${currentMonth}`);
  }
  const dashboard = await getDashboard(month);
  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <div className="flex flex-col space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Header responsivo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-0">
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <AiReportButton />
            <TimeSelect />
          </div>
        </div>

        {/* Layout principal responsivo */}
        <div className="grid grid-cols-1 gap-4 overflow-hidden sm:gap-6 xl:grid-cols-[2fr,1fr]">
          {/* Coluna principal */}
          <div className="flex flex-col gap-4 overflow-hidden sm:gap-6">
            {/* Cards de resumo */}
            <SumaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />

            {/* Gráficos responsivos */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="md:col-span-2 xl:col-span-1">
                <TransactionsPieChats {...dashboard} />
              </div>
              <div className="md:col-span-2 xl:col-span-2">
                <ExpensesPerCategory
                  expensesPerCategory={dashboard.totalExpensePerCategory}
                />
              </div>
            </div>
          </div>

          {/* Últimas transações - responsivo */}
          <div className="xl:max-h-screen xl:overflow-y-auto">
            <LastTransactions lastTransactions={dashboard.lastTransactions} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
