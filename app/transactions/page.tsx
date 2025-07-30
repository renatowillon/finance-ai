import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { TransactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transactions-button";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { pegarUsuarioToken } from "../_lib/session";

const TransactionsPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await pegarUsuarioToken(token!);
  if (!user) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: { userId: user.userId },
    orderBy: { createAt: "desc" },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <div className="space-y-6 p-6">
        {/* titulo e botão */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>

        <ScrollArea>
          <DataTable
            columns={TransactionsColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </ScrollArea>
      </div>
    </>
  );
};
export default TransactionsPage;
