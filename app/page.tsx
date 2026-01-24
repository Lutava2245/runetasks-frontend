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
        <p>Verificando sessão...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 z-40 w-full shadow-md p-4 bg-background">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-(--primary) hover:text-(--dark-primary) transition duration-150">
            <Image
              src={logo}
              alt="Logo RuneTasks"
              width={32}
              height={32}
            />
            <h1>RuneTasks</h1>
          </Link>

          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="text-base py-1.5 px-4"
          >
            Login / Cadastro
          </Button>
        </div>
      </header>

      <main className="grow pt-20">
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Transforme suas tarefas em uma <span className="text-(--primary)">jornada épica!</span>
            </h2>

            <div className="flex space-x-4 mb-10">
              <Button variant="primary" className="text-lg px-8" onClick={() => setIsModalOpen(true)}>
                Comece agora
              </Button>
              <Link href="#about" passHref>
                <Button variant="outline" className="text-lg px-8">
                  Saiba mais
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-(--card) rounded-xl shadow-lg border-t-4 border-(--primary)/70">
                <h3 className="text-xl font-bold mb-2 text-(--primary)">Crie tarefas</h3>
                <p className="text-sm">Organize suas tarefas e ganhe recompensas enquanto progride nas suas habilidades.</p>
              </div>
              <div className="p-4 bg-(--card) rounded-xl shadow-lg border-t-4 border-(--primary)/70">
                <h3 className="text-xl font-bold mb-2 text-(--primary)">Ganhe XP</h3>
                <p className="text-sm">Ganhe pontos de experiência por cada tarefa completa.</p>
              </div>
              <div className="p-4 bg-(--card) rounded-xl shadow-lg border-t-4 border-(--primary)/70">
                <h3 className="text-xl font-bold mb-2 text-(--primary)">Eleve suas Habilidades</h3>
                <p className="text-sm">Melhore suas habilidades enquanto avança na sua jornada!</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-white/50" />

        <section id="about" className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold mb-4">Objetivo do RuneTasks</h1>
            <p className="text-lg leading-relaxed">
              O <strong className="text-(--primary)">RuneTasks</strong> é uma aplicação desenvolvida para ajudar os usuários a organizar suas tarefas diárias de maneira eficiente e motivadora.
              Ao completar tarefas, os usuários acumulam pontos que podem ser trocados por recompensas.
              Nosso objetivo é proporcionar uma experiência agradável e eficiente, promovendo a organização pessoal e a produtividade
              através de um sistema de recompensas que motiva o cumprimento de tarefas em troca de momentos de lazer.
            </p>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <Image
              src={logo}
              alt="Logo RuneTasks"
              width={300}
              height={300}
              priority
            />
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-(--card) rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-(--primary) gap-2">
                <Target/>
                Função
              </h2>
              <p className="font-medium mb-3">
                Ele é projetado para ajudar os usuários a organizar suas rotinas diárias, incentivando a produtividade e o cumprimento de metas pessoais.
              </p>
              <p className="text-sm">
                O RuneTasks busca proporcionar uma experiência agradável e eficiente, promovendo a organização pessoal e a produtividade.
              </p>
            </div>
            <div className="p-6 bg-(--card) rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-(--primary) gap-2">
                <Earth/>
                Sobre o Projeto
              </h2>
              <p className="font-medium mb-3">
                Este projeto foi desenvolvido como trabalho de conclusão do curso (TCC) das atividades acadêmicas da Fatec de Praia Grande.
              </p>
              <p className="text-sm">
                O objetivo é aplicar conhecimentos adquiridos em sala de aula em um contexto prático.
              </p>
            </div>

            <div className="p-6 bg-(--card) rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-(--primary) gap-2">
                <Cpu/>
                Tecnologias Utilizadas
              </h2>
              <ul className="space-y-2">
                <li><strong>Frontend:</strong> Next.js (com TailwindCSS)</li>
                <li><strong>Backend:</strong> Spring Boot Framework (Java)</li>
                <li><strong>Banco de Dados:</strong> MySQL</li>
                <li><strong>Autenticação:</strong> JSON Web Token (JWT)</li>
              </ul>
            </div>
          </div>
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
