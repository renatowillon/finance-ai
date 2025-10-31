"use client";

import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";
import { CardDashboard } from "./_components/cardDashboard";
import { TituloPadrao } from "./_components/tituloPadrao";

const Configuracao = () => {
  return (
    <div className="space-y-6 p-6 lg:px-36">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Dashboard wFinance"
        descricao="Visão geral do sistema e métricas principais"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardDashboard
          titulo="Total de Usuários"
          icon={<Users className="text-primary" />}
          valor="520"
          descricao="+23.8% este mês"
        />
        <CardDashboard
          titulo="Assinaturas Ativas"
          icon={<TrendingUp className="text-primary" />}
          valor="310"
          descricao="59.6% conversão"
        />
        <CardDashboard
          titulo="Receita Mensal"
          icon={<DollarSign className="text-primary" />}
          valor="R$ 25.900"
          descricao="+18.2% vs mês anterior"
        />
        <CardDashboard
          titulo="Crescimento"
          icon={<Activity className="text-primary" />}
          valor="+ 23.9%"
          descricao="Crescimento mensal médio"
        />
      </div>
    </div>
  );
};
export default Configuracao;
