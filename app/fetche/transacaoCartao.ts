import axios from "axios";

export const pegarTransacaoPorCartao = async (id: string) => {
  const response = await axios.get(`/api/transacaoCartao/${id}`);
  return response.data;
};
