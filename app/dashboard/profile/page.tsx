'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import FormField from "@/src/components/ui/FormField";
import { useAuth } from "@/src/contexts/AuthContext";
import { useSkills } from "@/src/contexts/SkillContext";
import { useTasks } from "@/src/contexts/TaskContext";
import { changePassword, updateUser } from "@/src/services/userService";
import { ChangePasswordRequest, UserUpdateRequest } from "@/src/types/user";
import { formatDate } from "@/src/utils/date";
import { getAvatarIcon } from "@/src/utils/userAvatar";
import { Award, Calendar, CheckCircle, Coins, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { tasks } = useTasks();
  const { skills } = useSkills();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData: UserUpdateRequest = { name };
    const newPasswordRequest: ChangePasswordRequest = { currentPassword, newPassword };

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      if (user) {
        try {
          const response = await changePassword(user.id, newPasswordRequest);
          if (response.status === 204) {
            toast.success("A senha foi alterada com sucesso.");

            await refreshUser();
          }
        } catch (error: any) {
          if (error?.response?.status === 400) {
            toast.error("A senha está incorreta");
          } else if (error?.response?.status === 409) {
            toast.error("A senha atual é idêntica a anterior");
          } else {
            toast.error("Ocorreu um erro ao alterar senha");
            console.error(error);
          }
        }
      }
    }

    if (name !== user?.name) {
      console.log(user?.name)
      if (user) {
        try {
          const response = await updateUser(user.id, userData);
          if (response.status === 204) {
            toast.success("Salvo!");

            await refreshUser();
          }
        } catch (error: any) {
          toast.error("Ocorreu um erro ao atualizar nome do usuário");
          console.error(error);
        }
      }
    }

    if (name === user?.name && !newPassword) {
      toast.info("As informações não foram alteradas");
    }
  }

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Perfil</h2>
        <p className="text-sm">Gerencie sua conta</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <Card className="border-2 hover:border-(--primary)/30 text-center transition-all">
            <div className="w-20 h-20 mx-auto mb-3 text-5xl flex items-center justify-center border-2 transition-transform bg-background border-(--primary) rounded-lg">
              {getAvatarIcon(user && user.currentAvatarIcon)}
            </div>
            <h3 className="text-sm font-bold items-center mb-1">{user?.nickname}</h3>
            <p className="text-xs mb-2">{user?.email}</p>
            <Badge className="text-(--primary) border-(--primary)">
              Nível {user?.level}
            </Badge>
          </Card>

          <Card className="border-2 hover:border-(--secondary)/30 text-center transition-all">
            <h2 className="font-bold mb-3">Estatísticas</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border-2 border-(--primary)/30 bg-background p-2">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5" />
                  XP
                </span>
                <span className="font-bold">{user?.totalXp}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 border-(--primary)/30 bg-background p-2">
                <span className="flex items-center gap-1">
                  <Coins className="w-5 h-5" />
                  Moedas
                </span>
                <span className="font-bold">{user?.totalCoins}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 border-(--primary)/30 bg-background p-2">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-5 h-5" />
                  Tarefas
                </span>
                <span className="font-bold">{tasks.length}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 border-(--primary)/30 bg-background p-2">
                <span className="flex items-center gap-1">
                  <Award className="w-5 h-5" />
                  Skills
                </span>
                <span className="font-bold">{skills.length}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 border-(--primary)/30 bg-background p-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  Membro
                </span>
                <span className="font-bold">{user && formatDate(user.createdAt)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card className="border-2 hover:border-(--primary)/30 transition-all">
            <h2 className="font-bold mb-3 text-center">Configurações</h2>
            <form onSubmit={handleUpdateUser} autoComplete="off">
              <FormField
                id="name"
                label="Nome"
                value={name}
                placeholder={name}
                onChange={e => setName(e.target.value)}
              />

              <FormField
                id="current-password"
                label="Senha atual"
                type="password"
                value={currentPassword}
                placeholder="••••••••"
                onChange={e => setCurrentPassword(e.target.value)}
              />

              <FormField
                id="password"
                label="Nova senha"
                type="password"
                value={newPassword}
                placeholder="••••••••"
                onChange={e => setNewPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                title="Mínimo de 8 caracteres, contendo letras maiusculas, mínusculas e números"
              />

              <FormField
                id="confirmPassword"
                label="Confirmar senha"
                type="password"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={e => setConfirmPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
              />

              <Button type="submit" className="w-full text-xs">
                Salvar
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
