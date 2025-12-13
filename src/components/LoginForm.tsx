'use client';

import React, { useState } from 'react';
import { toast } from "sonner";
import FormField from './ui/FormField';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

export default function LoginForm() {
  const {login} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Preencha o email/nickname e a senha.");
      return;
    }

    try {
      await login({username, password });
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Não foi possível realizar login.")
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="username"
        label="E-mail/Nickname"
        value={username}
        placeholder="Digite seu email ou nickname"
        onChange={e => setUsername(e.target.value)}
        required
      />

      <FormField
        id="password"
        label="Senha"
        type="password"
        value={password}
        placeholder="Digite sua senha"
        onChange={e => setPassword(e.target.value)}
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