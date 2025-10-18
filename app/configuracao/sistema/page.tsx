"use client";

import { TituloPadrao } from "../_components/tituloPadrao";

const Sistema = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}

      <TituloPadrao
        titulo="Status do Sistema"
        descricao="Monitore a saúde do sistema, logs e integrações"
      />
    </div>
  );
};
export default Sistema;
