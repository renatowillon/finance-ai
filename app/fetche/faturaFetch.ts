import axios from "axios";

interface FaturaFechadaPayload {
  competencia: string;
  cartaoCreditoId: string;
}

interface FaturaFechadaResponse {
  fechada: boolean;
}

export async function verificarFaturaFechada(
  payload: FaturaFechadaPayload,
): Promise<boolean> {
  const { data } = await axios.post<FaturaFechadaResponse>(
    "/api/faturaEstaFechada",
    payload,
  );

  return data.fechada;
}
