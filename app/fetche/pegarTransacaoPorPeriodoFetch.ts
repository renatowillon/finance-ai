import axios from "axios";

interface BuscarTransacaoCartaoParams {
  userId: number;
  dataInicio: Date | string;
  dataFim: Date | string;
}

export async function buscarTransacoesCartaoPorPeriodoFetch({
  userId,
  dataInicio,
  dataFim,
}: BuscarTransacaoCartaoParams) {
  const response = await axios.post(`api/cartaoCredito/transacoes`, {
    userId,
    dataInicio,
    dataFim,
  });
  return response.data;
}
