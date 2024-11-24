import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center gap-3 p-8">
        <p className="mb-8 text-slate-600/50">Logo do SaaS</p>
        <h1 className="mb-3 text-4xl font-bold">Bem-Vindo</h1>
        <p className="mb-3 text-muted-foreground">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
        <Button variant={"outline"}>
          <LogInIcon className="mr-2" /> Faça Login ou criar conta
        </Button>
      </div>
      <div className="relative h-full w-full">
        <Image
          src="/loginPage.png"
          alt="Faça Login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};
export default LoginPage;
