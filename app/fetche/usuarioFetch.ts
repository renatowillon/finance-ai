import axios from "axios";
import { TypeUsuario, TypeUsuarioInput } from "../types";

export const fetchUsuarios = async () => {
  const response = await axios.get("/api/usuarios");
  return response.data;
};

export const CriarUsuario = async (usuario: TypeUsuarioInput) => {
  const response = await axios.post(`/api/usuarios`, usuario);
  return response.data;
};

export const AtualizarUsuarios = async (id: number, usuario: TypeUsuario) => {
  const response = await axios.put(`/api/usuarios/${id}`, usuario);
  return response.data;
};
