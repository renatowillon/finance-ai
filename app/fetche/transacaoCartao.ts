import axios from "axios";
import { TypeTransacaoCartao, TypeTransacaoCartaoInput } from "../types";

export const pegarTransacaoPorCartao = async (id: string) => {
  const response = await axios.get(`/api/transacaoCartao/${id}`);
  return response.data;
};

export const criarTransacaoCartao = async (data: TypeTransacaoCartaoInput) => {
  const response = await axios.post("/api/transacaoCartao", data);
  return response.data;
};

export const atualizarTransacaoCartao = async (
  id: string,
  data: TypeTransacaoCartao,
) => {
  const response = await axios.put(`/api/transacaoCartao/${id}`, data);
  return response.data;
};
