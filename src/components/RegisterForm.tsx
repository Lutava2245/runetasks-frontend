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
      toast.info("Preencha os campos necessários para cadastrar");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    const newUser: UserCreateRequest = { name, nickname, email, password };

    try {
      const response = await registerUser(newUser);
      if (response.status === 201) {
        toast.success("Conta criada com sucesso!");
      }

      try {
        await login({ username: email, password });
      } catch (error) {
        toast.error("Não foi possível realizar login")
        console.error(error);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.info("Email ou nickname já existem!");
      } else {
        toast.error("Ocorreu um erro ao criar conta");
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        label="Nome"
        value={name}
        placeholder="Digite seu nome"
        onChange={e => setName(e.target.value)}
        required
      />

      <FormField
        id="nickname"
        label="Nickname"
        value={nickname}
        placeholder="Digite seu nickname"
        onChange={e => setNickname(e.target.value)}
        required
      />

      <FormField
        id="email"
        label="E-mail"
        type="email"
        value={email}
        placeholder="Digite seu email"
        onChange={e => setEmail(e.target.value)}
        required
      />

      <FormField
        id="password"
        label="Senha"
        type="password"
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
        title="Mínimo de 8 caracteres, contendo letras maiusculas, mínusculas e números"
        value={password}
        placeholder="••••••••"
        onChange={e => setPassword(e.target.value)}
        required
      />

      <FormField
        id="confirmPassword"
        label="Confirmar senha"
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
        Cadastrar
      </Button>
    </form>
  );
}