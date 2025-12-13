'use client'

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/src/contexts/AuthContext";
import { registerUser } from "@/src/services/userService";
import { UserCreateRequest } from "@/src/types/user";
import FormField from "./ui/FormField";
import Button from "./ui/Button";

export default function RegisterForm() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nickname || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos para cadastro.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const newUser: UserCreateRequest = {
      name,
      nickname,
      email,
      password
    };

    try {
      const response = await registerUser(newUser);

      if (response.status === 201) {
        toast.success("Conta criada com sucesso!");
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error("Email ou nickname já existem.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
      console.error(error);
    }

    try {
      await login({username: email, password });
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Não foi possível realizar login.")
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        layout='horizontal'
        label="Nome"
        value={name}
        placeholder="Digite seu nome"
        onChange={e => setName(e.target.value)}
        required
      />

      <FormField
        id="nickname"
        layout='horizontal'
        label="Nickname"
        value={nickname}
        placeholder="Digite seu nickname"
        onChange={e => setNickname(e.target.value)}
        required
      />

      <FormField
        id="email"
        layout='horizontal'
        label="E-mail"
        type="email"
        value={email}
        placeholder="Digite seu email"
        onChange={e => setEmail(e.target.value)}
        required
      />

      <FormField
        id="password"
        layout='horizontal'
        label="Senha"
        type="password"
        value={password}
        placeholder="••••••••"
        onChange={e => setPassword(e.target.value)}
        required
      />

      <FormField
        id="confirmPassword"
        layout='horizontal'
        label="Confirmar senha"
        type="password"
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
        Entrar
      </Button>
    </form>
  );
}