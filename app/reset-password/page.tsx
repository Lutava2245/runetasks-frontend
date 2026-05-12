'use client';

import logo from "@/src/assets/logo.png";
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import FormField from '@/src/components/ui/FormField';
import { useAuth } from "@/src/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetToken = searchParams.get('tk');

  useEffect(() => {
    if (!resetToken) {
      router.replace('/forgot-password');
    }
  }, [resetToken, router]);

  if (!resetToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.info("Preencha os campos necessários para enviar");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      const response = await resetPassword({ resetToken, newPassword });

      if (response.status === 204) {
        toast.success("Senha alterada com sucesso.")
        router.replace('/')
      }
    } catch (error) {
      toast.error('Não foi possível alterar sua senha. Tente novamente.')
      console.error(error);
      router.replace('/forgot-password');
    }
  }

  return (
    <div className="h-screen flex flex-col">
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
            Trocar Senha
          </h2>
          <p className="text-sm mb-2">
            Crie uma nova senha para o seu perfil.
          </p>
          <p className="text-sm mb-6">
            Ela deve possuir no mínimo <strong>8 caracteres</strong>, contendo obrigatoriamente <strong>letras maiúsculas, minúsculas e números</strong>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="password"
              label="Nova Senha"
              type="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
              title="Mínimo de 8 caracteres, contendo letras maiusculas, mínusculas e números"
              value={newPassword}
              placeholder="••••••••"
              onChange={e => setNewPassword(e.target.value)}
              required
            />

            <FormField
              id="confirmPassword"
              label="Confirmar Nova Senha"
              type="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
              value={confirmPassword}
              placeholder="••••••••"
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Salvar
            </Button>
          </form>
        </Card>
      </main>

      <footer className="p-6 text-center bottom-0">
        <p className="text-sm">© {new Date().getFullYear()} RuneTasks — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}