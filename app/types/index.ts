export interface TypeBanco {
  id: number;
  nome: string;
  tipo: "POUPANCA" | "CONTA_CORRENTE" | "CARTAO_CREDITO";
  saldoInicial: number;
  saldoAtual: number;
  cor: string;
  userId: number;
}

export type TypeBancoInput = Omit<TypeBanco, "id" | "saldoAtual">;

export interface TypeCategoria {
  id: number;
  nome: string;
  tipo: "DEPOSITO" | "DESPESA";
  userId: number;
}

export interface TypeUsuarioLogado {
  userId: number;
  email: string;
  name: string;
  plano: string;
  status: boolean;
}

export interface TypeInvestimento {
  id: number;
  userId: number;
  nome: string;
  descricao: string;
  meta: number;
  valorAtual: number;
  cor: string;
  status: "ATIVO" | "CONCLUIDO" | "CANCELADO";
}
export type TypeInvestimentoInput = Omit<TypeInvestimento, "id">;
