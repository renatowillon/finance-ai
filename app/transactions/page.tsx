import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { TransactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transactions-button";
import Navbar from "../_components/navbar";

const TransactionsPage = async () => {
  const transactions = await db.transaction.findMany({});

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        {/* titulo e botão */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton />
        </div>

        <DataTable
          columns={TransactionsColumns}
          data={JSON.parse(JSON.stringify(transactions))}
        />
      </div>
    </>
  );
};
export default TransactionsPage;
