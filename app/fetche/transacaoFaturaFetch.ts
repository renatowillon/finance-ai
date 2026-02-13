import axios from "axios";

export const pegarTransacaoFatura = async (idFatura: string) => {
  const response = await axios.get(`/api/transacaoFatura/${idFatura}`);
  return response.data;
};
