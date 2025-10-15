import axios from "axios";
import { TypeInvestimentoInput } from "../types";

export const fetchInvestimento = async () => {
  const response = await axios.get("/api/investimentos");
  return response.data;
};

export const pegarUmInvestimento = async (idInvestimento: number) => {
  const response = await axios.get(`/api/investimentos/${idInvestimento}`);
  return response.data;
};

export const criarInvestimento = async (
  investimento: TypeInvestimentoInput,
) => {
  const response = await axios.post("/api/investimentos", investimento);
  return response.data;
};

export const atualizarInvestimento = async (
  id: number,
  investimento: TypeInvestimentoInput,
) => {
  const response = await axios.put(`/api/investimentos/${id}`, investimento);
  return response.data;
};

export const deletarInvestimento = async (id: number) => {
  const response = await axios.delete(`/api/investimentos/${id}`);
  return response.data;
};
