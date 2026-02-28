"use client";
import Image from "next/image";
import { Button } from "../_components/ui/button";
import { Home, InfoIcon, Loader2Icon, LogInIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchemaUser } from "./components/formSchemaUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../_components/ui/tooltip";
import { useState } from "react";
import TelaCarregamento from "./components/telaAnimacao";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// 👈 importa a animação

const LoginPage = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  const form = useForm<z.infer<typeof formSchemaUser>>({
    resolver: zodResolver(formSchemaUser),
    defaultValues: { email: "", senha: "" },
  });
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchemaUser>) => {
    try {
      const res = await axios.post("/api/login", {
        email: values.email,
        senha: values.senha,
      });
      toast.success("Login realizado com sucesso");
      console.log("✅ Login sucesso:", res.data);
      setShowAnimation(true); // 🔥 mostra animação
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Erro no Login! verifique email e senha");
      console.error(
        "❌ erro no Login: ",
        error.response?.data || error.message,
      );
    }
    console.log(values);
  };

  // 👇 se a animação estiver ativa, mostra a TelaAnimacao
  if (showAnimation) return <TelaCarregamento />;

  function irParaHome() {
    router.push("/lp");
  }

  // 👇 caso contrário, mostra o formulário
  return (
    <div className="flex h-full flex-col md:grid md:grid-cols-2">
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center gap-3 p-8">
        <p className="mb-8 text-slate-600/50">
          <Image
            src="/logo-wfinance.png"
            width={173}
            height={39}
            alt="Wfinance"
          />
        </p>
        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="mb-3 text-muted-foreground">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <p>Email</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon
                            className="text-muted-foreground"
                            size={20}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-center font-bold">
                            Acesso Demonstração
                          </p>
                          <p className="text-muted-foreground">
                            Usuario: demo@wdev.com
                          </p>
                          <p className="text-muted-foreground">Senha: 123</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="demo@wdev.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" variant={"outline"}>
              {form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2Icon className="mr-2 animate-spin" />
                  Entrando
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogInIcon className="mr-2" />
                  Fazer Login
                </div>
              )}
            </Button>
          </form>
        </Form>
        <Button
          type="button"
          className="w-full"
          variant={"outline"}
          onClick={irParaHome}
        >
          <Home className="mr-2" />
          Voltar para a página inicial
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
