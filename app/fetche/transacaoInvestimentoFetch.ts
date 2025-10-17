import axios from "axios";
import {
  TypeTransacaoInvestimento,
  TypeTransacaoInvestimentoInput,
} from "../types";

export const pegarTransacaoInvestimento = async (idInvestimento: number) => {
  const response = await axios.get(
    `/api/transacaoInvestimento/${idInvestimento}`,
  );
  return response.data;
};

export const criarTransacaoInvestimento = async (
  investimento: TypeTransacaoInvestimentoInput,
) => {
  const response = await axios.post("/api/transacaoInvestimento", investimento);
  return response.data;
};

export function calcularResumo(transacoes: TypeTransacaoInvestimento[]) {
  let totalDepositos = 0;
  let totalRetiradas = 0;

  for (const t of transacoes) {
    const valor = parseFloat(String(t.valor));
    if (t.tipo === "DEPOSITO") {
      totalDepositos += valor;
    } else if (t.tipo === "RETIRADA") {
      totalRetiradas += valor;
    }
  }
  const qtdTransacoes = transacoes.length;
  const saldoTotal = totalDepositos - totalRetiradas;
  return {
    totalDepositos,
    totalRetiradas,
    qtdTransacoes,
    saldoTotal,
  };
}
