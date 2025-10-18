"use client";

import { TituloPadrao } from "./_components/tituloPadrao";

const Configuracao = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Dashboard wFinance"
        descricao="Visão geral do sistema e métricas principais"
      />
    </div>
  );
};
export default Configuracao;
