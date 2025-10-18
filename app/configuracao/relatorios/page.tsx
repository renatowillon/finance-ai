"use client";

import { TituloPadrao } from "../_components/tituloPadrao";

const Relatorio = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}

      <TituloPadrao
        titulo="Relatórios e Analytics"
        descricao="Análise detalhada de crescimento, retenção e engajamento"
      />
    </div>
  );
};
export default Relatorio;
