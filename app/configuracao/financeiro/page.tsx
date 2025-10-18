"use client";

import { TituloPadrao } from "../_components/tituloPadrao";

const Financeiro = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}

      <TituloPadrao
        titulo="Controle Financeiro"
        descricao="Gerencie pagamentos, planos e modalidades de cobrança"
      />
    </div>
  );
};
export default Financeiro;
