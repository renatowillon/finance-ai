"use client";
import { TituloPadrao } from "../_components/tituloPadrao";
import { toast } from "sonner";

const Usuarios = () => {
  function addUsuario() {
    toast.info("Em breve");
  }
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Gerenciamento de Usuários"
        descricao="Gerencie todos os usuários cadastrados no wFinance"
        onClick={addUsuario}
        tituloButao="Novo Usuário"
      />
    </div>
  );
};
export default Usuarios;
