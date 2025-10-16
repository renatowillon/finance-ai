import axios from "axios";
import { TypeInvestimentoInput } from "../types";

export const pegarTransacaoInvestimento = async (idInvestimento: number) => {
  const response = await axios.get(
    `/api/transacaoInvestimento/${idInvestimento}`,
  );
  return response.data;
};

export const criarTransacaoInvestimento = async (
  investimento: TypeInvestimentoInput,
) => {
  const response = await axios.post("/api/transacaoInvestimento", investimento);
  return response.data;
};
