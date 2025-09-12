import AddTransactionButton from "../_components/add-transactions-button";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";

const Bancos = async () => {
  const usuarioPodeAdicionarTransacao = await canUserAddTransaction();
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Bancos</h1>
        <AddTransactionButton
          usuarioPodeAdicionarTransacao={usuarioPodeAdicionarTransacao}
        />
      </div>
    </div>
  );
};
export default Bancos;
