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
