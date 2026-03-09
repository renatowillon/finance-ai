import axios from "axios";

interface FaturaFechadaPayload {
  competencia: string;
  cartaoCreditoId: string;
}

interface FaturaFechadaResponse {
  fechada: boolean;
  faturaId: string;
}

interface PagarFaturaPayload {
  faturaId: string;
  valorPago: string;
  bancoId: number;
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

export async function pagarFatura(payload: PagarFaturaPayload) {
  const response = await axios.post("/api/fatura/pagar", payload);
  return response.data;
}

export async function pegarHistoricoFatura(cartaoId: string) {
  const response = await axios.get(`/api/fatura/historico/${cartaoId}`);
  return response.data;
}
