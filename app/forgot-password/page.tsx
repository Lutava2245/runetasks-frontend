'use client';

import Link from "next/link";
import Image from "next/image";
import logo from "@/src/assets/logo.png";
import Card from "@/src/components/ui/Card";
import FormField from "@/src/components/ui/FormField";
import { useState } from "react";
import Button from "@/src/components/ui/Button";
import { toast } from "sonner";
import { useAuth } from "@/src/contexts/AuthContext";

export default function ForgotPassword() {
  const { sendResetLink } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [sendedEmail, setSendedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.info("Preencha os campos necessários para enviar o email.");
      return;
    }

    try {
      sendResetLink({ email });
      setSendedEmail(email);
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Não foi possível enviar email")
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="top-0 w-full shadow-md p-4 bg-background flex justify-between items-center h-20">
        <Link href="/" className="flex items-center text-xl font-bold text-(--primary) hover:text-(--dark-primary) transition duration-150">
          <Image
            src={logo}
            alt="Logo RuneTasks"
            width={32}
            height={32}
          />
          <h1>RuneTasks</h1>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-10">
        <Card className="max-w-md bg-(--card)/50 border shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Esqueci minha senha
          </h2>
          <p className="text-sm mb-2">
            Informe seu endereço de email para receber um email de redefinição de senha.
          </p>
          <p className="text-sm mb-6">
            Caso este e-mail cadastrado, você receberá um link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="email"
              label="E-mail"
              type="email"
              value={email}
              placeholder="Digite seu email"
              onChange={e => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Enviar
            </Button>
          </form>

          {isSubmitted && (
            <p className="text-md mt-6 text-(--secondary)">
              Um link de recuperação foi enviado para <br />
              <strong className="text-(--primary)">{sendedEmail}</strong>.
            </p>
          )}
        </Card>
      </main>

      <footer className="p-6 text-center bottom-0">
        <p className="text-sm">© {new Date().getFullYear()} RuneTasks — Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
