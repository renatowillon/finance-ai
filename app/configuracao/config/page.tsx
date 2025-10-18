"use client";

import { TituloPadrao } from "../_components/tituloPadrao";

const Relatorio = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Configurações do Sistema"
        descricao="Configure planos, integrações e preferências gerais"
      />
    </div>
  );
};
export default Relatorio;
