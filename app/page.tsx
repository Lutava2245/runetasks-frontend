'use client';

import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/ui/Button"
import { useEffect, useState } from "react";
import AuthModal from "@/src/components/AuthModal";
import logo from "@/src/assets/logo.png";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p>Verificando sessão...</p>
      </div>
    );
  }

  const FeatureItem = (title: string, description: string) => (
    <div className="p-4 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  const SectionDetail = (title: string, lead: string, body: string) => (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">{title}</h2>
      <p className="text-gray-700 font-medium mb-3">{lead}</p>
      <p className="text-gray-600 text-sm">{body}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="fixed top-0 z-40 w-full bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-800 transition duration-150">
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
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Transforme seus estudos em uma <span className="text-blue-600">jornada épica!</span>
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
              {FeatureItem("Crie tarefas", "Organize suas tarefas e ganhe recompensas enquanto progride nos seus estudos.")}
              {FeatureItem("Ganhe XP", "Ganhe pontos de experiência por cada tarefa completa.")}
              {FeatureItem("Eleve suas Habilidades", "Melhore suas habilidades enquanto avança na sua jornada!")}
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo RuneTasks grande"
              width={400}
              height={400}
              priority
              className="rounded-full shadow-2xl animate-pulse-slow" // Adicionando uma sombra e animação sutil
            />
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200" />

        <section id="about" className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Objetivo do RuneTasks</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              O **RuneTasks** é uma aplicação desenvolvida para ajudar os usuários a organizar suas tarefas diárias de maneira eficiente e motivadora. Ao completar tarefas, os usuários acumulam pontos que podem ser trocados por recompensas. Nosso objetivo é proporcionar uma experiência agradável e eficiente, promovendo a organização pessoal e a produtividade através de um sistema de recompensas que motiva o cumprimento de tarefas em troca de momentos de lazer.
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

        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            {SectionDetail("🎯 Função", "Ele é projetado para ajudar os usuários a organizar suas rotinas diárias, incentivando a produtividade e o cumprimento de metas pessoais.", "O RuneTasks busca proporcionar uma experiência agradável e eficiente, promovendo a organização pessoal e a produtividade.")}
            {SectionDetail("🌍 Sobre o Projeto", "Este projeto foi desenvolvido como parte das atividades acadêmicas da Fatec de Praia Grande.", "O objetivo é aplicar conhecimentos adquiridos em sala de aula em um contexto prático.")}

            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-blue-600">🧩 Tecnologias Utilizadas</h2>
              <ul className="space-y-2 text-gray-600">
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

      <footer className="bg-gray-800 text-white p-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} RuneTasks — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
