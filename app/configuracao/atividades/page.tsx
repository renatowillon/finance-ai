"use client";

import { TituloPadrao } from "../_components/tituloPadrao";

const Relatorio = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}

      <TituloPadrao
        titulo="Registro de Atividades"
        descricao="Acompanhe todas as ações dos usuários no sistema"
      />
    </div>
  );
};
export default Relatorio;
