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
      <div className="flex flex-col space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <AiReportButton />
            <TimeSelect />
          </div>
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SumaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="grid grid-cols-3 grid-rows-1 gap-6">
              <TransactionsPieChats {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>

          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};
export default Home;
