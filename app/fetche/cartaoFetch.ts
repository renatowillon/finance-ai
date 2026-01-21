import axios from "axios";
import { TypeCartaoCredito, TypeCartaoCreditoInput } from "../types";

export const pegarCartoes = async () => {
  const response = await axios.get("/api/cartaoCredito");
  return response.data;
};

export const pegarUmCartao = async (id: string) => {
  const response = await axios.get(`/api/cartaoCredito/${id}`);
  return response.data;
};

export const criarCartao = async (dados: TypeCartaoCreditoInput) => {
  const response = await axios.post("/api/cartaoCredito", dados);
  return response.data;
};

export const atualizarCartao = async (id: string, dados: TypeCartaoCredito) => {
  const response = await axios.put(`/api/cartaoCredito/${id}`, dados);
  return response.data;
};

export const deletarCartao = async (id: string) => {
  const response = await axios.delete(`/api/cartaoCredito/${id}`);
  return response.data;
};
