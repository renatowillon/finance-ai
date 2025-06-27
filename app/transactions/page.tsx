import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { TransactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transactions-button";
import Navbar from "../_components/navbar";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
// import { useAuth } from "../context/AuthContext";

const TransactionsPage = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const { usrId } = useAuth();
  // if (!userId) {
  //   redirect("/login");
  // }

  const transactions = await db.transaction.findMany({
    // where: { userId },
  });
  const userCanAddTransaction = await canUserAddTransaction();
  return (
    <>
      <Navbar />
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
