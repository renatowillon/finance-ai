import axios from "axios";
import { TypeBanco, TypeBancoInput } from "../types";

export const fetchBanco = async () => {
  const response = await axios.get("/api/bancos");
  return response.data;
};

export const criarBanco = async (banco: TypeBancoInput) => {
  const response = await axios.post("/api/bancos", banco);
  return response.data;
};

export const atualizarBanco = async (id: number, banco: TypeBanco) => {
  const response = await axios.put(`/api/bancos/${id}`, banco);
  return response.data;
};

export const deletarBanco = async (id: number) => {
  const response = await axios.delete(`/api/bancos/${id}`);
  return response.data;
};
