import axios from "axios";

export const pegarSaldoPrevisto = async (idBanco: number, mes: string) => {
  const response = await axios.post(`/api/saldoPrevisto/${idBanco}`, { mes });
  return response.data;
};
