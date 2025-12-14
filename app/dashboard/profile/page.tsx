'use client';

import AvatarModal from "@/src/components/AvatarModal";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import FormField from "@/src/components/ui/FormField";
import { useAuth } from "@/src/contexts/AuthContext";
import { useSkills } from "@/src/contexts/SkillContext";
import { useTasks } from "@/src/contexts/TaskContext";
import { changePassword, updateUser } from "@/src/services/userService";
import { TaskResponse } from "@/src/types/task";
import { ChangePasswordRequest, UserUpdateRequest } from "@/src/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { user, refreshUser, logout } = useAuth();
  const { tasks } = useTasks();
  const { skills } = useSkills();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status !== "completed"));
  const [userAvatar, setUserAvatar] = useState<string>(user?.currentAvatarIcon || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshUser();
  }, [user]);

  useEffect(() => {
    setPendingTasks(tasks.filter(t => t.status !== "completed"));
  }, [tasks]);

  const formatDate = (date: Date): string => {
    const dateString = new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return dateString;
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }
      const newPasswordRequest: ChangePasswordRequest = {newPassword};

      if (user) {
        try {
          const response = await changePassword(user.id, newPasswordRequest);
          if (response.status === 204) {
            toast.success("A senha foi alterada.");
          }
        } catch (error: any) {
          if (error?.response?.status === 400) {
            toast.error("A senha atual é idêntica a existente.");
          } else {
            toast.error("Erro ao alterar senha. Tente novamente.");
          }
          console.error(error);
        }
      }
    }

    if (name == user?.name && !newPassword) {
      toast.info("As informações não foram alteradas.");
    } else {
      const userData: UserUpdateRequest = {name};

      if (user) {
        try {
          const response = await updateUser(user.id, userData);
          if (response.status === 204) {
            toast.success("Salvo!");
          }
        } catch (error: any) {
          toast.error("Erro ao atualizar informações. Tente novamente.");
          console.error(error);
        }
      }
    }
  }

  const handleLogout = () => {
    toast.info(user?.nickname + " saiu.");
    logout();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="mystic-glow">Perfil</span>
          </h2>
          <p className="text-muted-foreground text-xs">Gerencie sua conta</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-4">
            {/* Avatar Card */}
            <Card className="p-4 bg-card border-2 border-primary/30 text-center pixel-corners">
              <div className="w-20 h-20 mx-auto mb-3 border-4 border-primary/50 pixel-corners">
                <div className="text-5xl bg-primary/20 pixel-corners text-center">
                  {userAvatar}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 text-foreground">{user?.nickname}</h3>
              <p className="text-muted-foreground text-xs mb-3">{user?.email}</p>
              <Badge variant="secondary" className="mb-3 text-xs">
                Nível {user?.level}
              </Badge>
              <Button variant="outline" className="w-full text-xs" onClick={() => setIsModalOpen(true)}>
                Editar Avatar
              </Button>
            </Card>

            {/* Stats Card */}
            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <h4 className="text-sm font-bold mb-3 text-foreground">Estatísticas</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">XP</span>
                  </div>
                  <span className="font-bold text-foreground">{user?.totalXP}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Moedas</span>
                  </div>
                  <span className="font-bold text-foreground">{user?.totalCoins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tarefas</span>
                  </div>
                  <span className="font-bold text-foreground">{pendingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Skills</span>
                  </div>
                  <span className="font-bold text-foreground">{skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Membro</span>
                  </div>
                  <span className="font-bold text-foreground">{user && formatDate(user.createdAt)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Settings & Achievements */}
          <div className="md:col-span-2 space-y-4">
            {/* Account Settings */}
            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <h4 className="text-sm font-bold mb-3 text-foreground">Configurações</h4>
              <form onSubmit={handleUpdateUser} className="space-y-3" autoComplete="off">
                <FormField
                  id="name"
                  label="Nome"
                  value={name}
                  placeholder={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <FormField
                  id="password"
                  label="Senha"
                  type="password"
                  value={newPassword}
                  placeholder="••••••••"
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />

                <FormField
                  id="confirmPassword"
                  label="Confirmar senha"
                  type="password"
                  value={confirmPassword}
                  placeholder="••••••••"
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full text-xs">
                  Salvar
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <AvatarModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          user && setUserAvatar(user.currentAvatarIcon);
        }}
      />
    </div>
  );
};

export default Profile;
