import axios from "axios";

interface FaturaFechadaPayload {
  competencia: string;
  cartaoCreditoId: string;
}

interface FaturaFechadaResponse {
  fechada: boolean;
  faturaId: string;
}

export async function verificarFaturaFechada(
  payload: FaturaFechadaPayload,
): Promise<{ fechada: boolean; faturaId: string }> {
  const { data } = await axios.post<FaturaFechadaResponse>(
    "/api/faturaEstaFechada",
    payload,
  );

  return { fechada: data.fechada, faturaId: data.faturaId };
}

export async function PegarFaturas(id: string) {
  const response = await axios.get(`/api/fatura/${id}`);
  return response.data;
}

export async function ReabrirFatura(id: string) {
  const response = await axios.post(`/api/fatura/reabrir`, { id });
  return response.data;
}
