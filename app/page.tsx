'use client';

import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/ui/Button"
import { useEffect, useState } from "react";
import AuthModal from "@/src/components/AuthModal";
import logo from "@/src/assets/logo.png";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { Cpu, Earth, Target } from "lucide-react";
import Card from "@/src/components/ui/Card";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Verificando sessão...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full shadow-md p-4 bg-background flex justify-between">
        <Link href="/" className="flex items-center text-xl font-bold text-(--primary) hover:text-(--dark-primary) transition duration-150">
          <Image
            src={logo}
            alt="Logo RuneTasks"
            width={32}
            height={32}
          />
          <h1>RuneTasks</h1>
        </Link>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-4"
        >
          Login / Cadastro
        </Button>
      </header>

      <main className="pt-20">
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Transforme suas tarefas em uma <span className="text-(--primary)">jornada épica!</span>
            </h2>

            <div className="flex space-x-4 mb-10">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="px-8"
              >
                Comece agora
              </Button>
              <Link href="#about" passHref>
                <Button
                  variant="outline"
                  className="px-8"
                >
                  Saiba mais
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <Card className="p-4 rounded-xl shadow-lg border-t-4 border-(--primary)/70 text-(--primary) hover:border-(--secondary)/70 hover:text-(--secondary) transition duration-150">
                <h3 className="text-xl font-bold mb-2">Crie tarefas</h3>
                <p className="text-sm text-foreground">Organize suas tarefas e ganhe recompensas enquanto progride nas suas habilidades.</p>
              </Card>
              <Card className="p-4 rounded-xl shadow-lg border-t-4 border-(--primary)/70 text-(--primary) hover:border-(--secondary)/70 hover:text-(--secondary) transition duration-150">
                <h3 className="text-xl font-bold mb-2">Ganhe XP</h3>
                <p className="text-sm text-foreground">Ganhe pontos de experiência por cada tarefa completa.</p>
              </Card>
              <Card className="p-4 rounded-xl shadow-lg border-t-4 border-(--primary)/70 text-(--primary) hover:border-(--secondary)/70 hover:text-(--secondary) transition duration-150">
                <h3 className="text-xl font-bold mb-2">Eleve suas Habilidades</h3>
                <p className="text-sm text-foreground">Melhore suas habilidades enquanto avança na sua jornada!</p>
              </Card>
            </div>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-foreground/50" />

        <section id="about" className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Objetivo do RuneTasks</h1>
            <p className="text-lg leading-relaxed">
              O <strong className="text-(--primary)">RuneTasks</strong> é uma aplicação desenvolvida para ajudar os usuários a organizar suas tarefas diárias de maneira eficiente e motivadora.
              Ao completar tarefas, os usuários acumulam pontos que podem ser trocados por recompensas.
            </p>
            <p className="text-lg leading-relaxed">
              O objetivo do projeto é proporcionar uma experiência agradável e eficiente, promovendo a organização pessoal e a produtividade
              através de um sistema de recompensas que motiva o cumprimento de tarefas em troca de momentos de lazer.
            </p>
          </div>
          <Image
            src={logo}
            alt="Logo RuneTasks"
            width={800}
            height={800}
            priority
          />
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <Card className="p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-(--primary) gap-2">
                <Target />
                Função
              </h2>
              <p className="font-medium mb-3">
                Ele é projetado para ajudar os usuários a organizar suas rotinas diárias, incentivando a produtividade e o cumprimento de metas pessoais.
              </p>
              <p className="text-sm">
                O RuneTasks busca proporcionar uma experiência agradável e eficiente, promovendo a organização pessoal e a produtividade.
              </p>
            </Card>
            <Card className="p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-(--primary) gap-2">
                <Earth />
                Sobre o Projeto
              </h2>
              <p className="font-medium mb-3">
                Este projeto foi desenvolvido como trabalho de conclusão do curso (TCC) das atividades acadêmicas da Fatec de Praia Grande.
              </p>
              <p className="text-sm">
                O objetivo é aplicar conhecimentos adquiridos em sala de aula em um contexto prático.
              </p>
            </Card>

            <Card className="p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-(--primary) gap-2">
                <Cpu />
                Tecnologias Utilizadas
              </h2>
              <ul className="space-y-2">
                <li><strong>Frontend:</strong> Next.js (com TailwindCSS)</li>
                <li><strong>Backend:</strong> Spring Boot Framework (Java)</li>
                <li><strong>Banco de Dados:</strong> MySQL</li>
                <li><strong>Autenticação:</strong> JSON Web Token (JWT)</li>
              </ul>
            </Card>
        </section>

        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>

      <footer className="p-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} RuneTasks — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
