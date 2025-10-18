"use client";

import { TituloPadrao } from "../_components/tituloPadrao";

const Relatorio = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Central de Notificações"
        descricao="Gerencie lembretes, alertas e templates de mensagens"
      />
    </div>
  );
};
export default Relatorio;
