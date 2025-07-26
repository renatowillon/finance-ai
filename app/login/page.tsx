"use client";
import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchemaUser>>({
    resolver: zodResolver(formSchemaUser),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchemaUser>) => {
    try {
      const res = await axios.post("/api/login", {
        email: values.email,
        senha: values.senha,
      });
      console.log("✅ Login sucesso:", res.data);
      router.replace("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "❌ erro no Login: ",
        error.response?.data || error.message,
      );
    }
    console.log(values);
  };

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
        <h1 className="mb-3 text-4xl font-bold">Bem-Vindo</h1>
        <p className="mb-3 text-muted-foreground">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
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
                    <Input placeholder="*********" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" variant={"outline"}>
              <LogInIcon className="mr-2" /> Fazer Login
            </Button>
          </form>
        </Form>
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
