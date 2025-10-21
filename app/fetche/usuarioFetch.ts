import axios from "axios";

export const fetchUsuarios = async () => {
  const response = await axios.get("/api/usuarios");
  return response.data;
};
