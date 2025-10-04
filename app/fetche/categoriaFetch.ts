import axios from "axios";
import { TypeCategoria } from "../types";

export const fetchCategoria = async () => {
  const response = await axios.get("/api/categorias");
  return response.data;
};

export const pegarUmaCategoria = async (idCategoria: number) => {
  const response = await axios.get(`/api/categorias/${idCategoria}`);
  return response.data;
};

export const criarCategoria = async (categoria: Omit<TypeCategoria, "id">) => {
  const response = await axios.post("/api/categorias", categoria);
  return response.data;
};

export const atualizarCategoria = async (
  id: number,
  categoria: TypeCategoria,
) => {
  const response = await axios.put(`/api/categorias/${id}`, categoria);
  return response.data;
};

export const deletarCategoria = async (id: number) => {
  const response = await axios.delete(`/api/categorias/${id}`);
  return response.data;
};
