import axios from "axios";

export const fecharFaturaFetch = async (
  competencia: string,
  cartaoCreditoId: string,
) => {
  const response = await axios.post("/api/fatura/fechar", {
    competencia,
    cartaoCreditoId,
  });
  return response.data;
};
