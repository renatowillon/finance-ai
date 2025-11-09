import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { TransactionsColumns, TransactionWithCategoria } from "./_columns";
import AddTransactionButton from "../_components/add-transactions-button";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { obterUsuarioPorToken } from "../_lib/session";

const TransactionsPage = async () => {
  const armazenadorCookie = cookies();
  const token = armazenadorCookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }

  const transacoes = await db.transaction.findMany({
    where: { userId: usuario.userId },
    orderBy: { date: "desc" },
    include: { categoria: true },
  });

  const usuarioPodeAdicionarTransacao = await canUserAddTransaction();

  return (
    <>
      <div className="space-y-6 p-6">
        {/* titulo e botão */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton
            usuarioPodeAdicionarTransacao={usuarioPodeAdicionarTransacao}
          />
        </div>

        <ScrollArea>
          <DataTable<TransactionWithCategoria, unknown>
            columns={TransactionsColumns}
            data={JSON.parse(JSON.stringify(transacoes))}
          />
        </ScrollArea>
      </div>
    </>
  );
};
export default TransactionsPage;
