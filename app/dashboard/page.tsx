'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Progress from "@/src/components/ui/Progress";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAvatars } from "@/src/contexts/AvatarContext";
import { useSkills } from "@/src/contexts/SkillContext";
import { useTasks } from "@/src/contexts/TaskContext";
import { selectAvatar } from "@/src/services/userService";
import { AvatarResponse } from "@/src/types/avatar";
import { formatDate, isToday } from "@/src/utils/date";
import clsx from "clsx";
import { Check, Palette, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const { tasks, refreshTasks } = useTasks();
  const { skills, refreshSkills } = useSkills();
  const { avatars, refreshAvatars } = useAvatars();

  const [ownedAvatars, setOwnedAvatars] = useState<AvatarResponse[]>(() => avatars.filter(a => a.owned));

  useEffect(() => {
    refreshUser();
    refreshTasks();
    refreshSkills();
    refreshAvatars();
  }, [token]);

  useEffect(() => {
    setOwnedAvatars(avatars.filter(a => a.owned));
  }, [avatars]);

  const handleEquipCosmetic = async (avatar: AvatarResponse) => {
    if (user && user.currentAvatarName !== avatar.iconName) {
      try {
        const response = await selectAvatar(avatar.iconName);
        if (response.status === 204) {
          toast.success('Avatar atualizado!')
          await refreshUser();
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          toast.error("Não foi possível encontrar avatar");
        } else {
          toast.error("Ocorreu um erro ao equipar avatar");
        }
        console.error(error);
      }
    }
  };

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-sm">Continue sua jornada épica</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 hover:border-(--primary)/30 transition-all">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs">Nível</p>
                  <p className="text-2xl font-bold text-foreground">{user?.level}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-2">
                  XP
                  <span className="text-foreground font-bold">{user?.progressXP} / {user?.xpToNextLevel}</span>
                </div>
                <Progress value={user?.levelPercentage ?? 0} />
              </div>
            </Card>

            <Card className="border-2 hover:border-(--secondary)/30 transition-all">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs">Total XP</p>
                  <p className="text-2xl font-bold text-foreground">{user?.totalXP}</p>
                </div>
              </div>
              <p className="mt-3 text-xs">
                <span className="text-(--secondary) font-bold">-{user && user?.xpToNextLevel - user?.progressXP} XP</span> próx. nível
              </p>
            </Card>

            <Card className="border-2 hover:border-(--primary)/30 transition-all">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs">Moedas</p>
                  <p className="text-2xl font-bold text-foreground">{user?.totalCoins}</p>
                </div>
              </div>
              <Link href="/dashboard/store">
                <Button variant="outline" className="w-full mt-3 relative">
                  Loja
                  {(user?.unlockableItems ?? 0) > 0 && (
                    <span className="absolute top-1 right-1 flex" id="ping">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--secondary) opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-(--secondary)"></span>
                    </span>
                  )}
                </Button>
              </Link>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 hover:border-(--primary)/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  Tarefas
                </h3>
                <Link href="/dashboard/tasks">
                  <Button variant="outline" className="text-xs">Ver</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {tasks.sort((a, b) => {
                  if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
                  if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
                  if (a.status === b.status) {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                  }
                  return 0;
                }).slice(0, 5).map((task) => {
                  const taskCompleted = task.status === 'COMPLETED';

                  return (
                    <div
                      key={task.id}
                      className={clsx(
                        'flex items-center justify-between p-2 border border-(--primary)/30  rounded-lg',
                        (!taskCompleted && isToday(task.date)) && 'animate-pulse bg-(--primary)/25'
                      )}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 border flex items-center justify-center `}>
                          {taskCompleted && <strong><Check className="w-4 h-4" /></strong>}
                        </div>
                        <span className={`text-xs ${taskCompleted ? 'line-through' : ''}`}>
                          {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                        </span>
                        {task.status === 'PENDING' && (
                          <Badge className="text-xs">
                            {formatDate(task.date)}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-bold text-(--secondary)">+{task.taskXP}</span>
                    </div>
                  )
                })}
                {tasks.length === 0 && (
                  <div className="flex items-center justify-between p-2 border border-(--primary)/30  rounded-lg bg-background'">
                    <p className="text-sm">Nenhuma tarefa pendente</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-2 hover:border-(--primary)/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  Skills
                </h3>
                <Link href="/dashboard/skills">
                  <Button variant="outline" className="text-xs">Ver</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {skills.sort((a, b) => b.totalXP - a.totalXP)
                  .slice(0, 5).map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{skill.name}</span>
                        <span className="text-xs ">Lv {skill.level}</span>
                      </div>
                      <Progress value={skill.levelPercentage} className="h-1" />
                    </div>
                  ))
                }
                {skills.length === 0 && (
                  <div className="flex items-center justify-between p-2 border border-(--primary)/30  rounded-lg bg-background'">
                    <p className="text-sm">Nenhuma habilidade criada</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-2 hover:border-(--primary)/30 transition-all text-center">
            <h3 className="text-sm font-bold flex justify-center items-center gap-2 mb-3">
              <User />
              Avatar
            </h3>
            <div className="w-24 h-24 mx-auto mb-3 text-7xl flex items-center justify-center border-2 transition-transform bg-background border-(--primary) rounded-lg">
              {user?.currentAvatarIcon}
            </div>
            <p className="text-xs mb-2">{user?.name} - Nível {user?.level}</p>
            <Badge className="text-(--secondary) border-(--secondary)">
              {user?.totalCoins} Moedas
            </Badge>
          </Card>

          <Card className="border-2 hover:border-(--secondary)/30 transition-all text-center">
            <h3 className="text-sm font-bold flex justify-center items-center gap-2 mb-3">
              <Palette />
              Meus Cosméticos
            </h3>
            <div>
              {ownedAvatars.map((avatar) => (
                <Button
                  key={avatar.id}
                  onClick={() => handleEquipCosmetic(avatar)}
                  title={avatar.title}
                  className={`border-2 w-18 h-18 text-xl m-3
                    bg-background hover:bg-(--dark-primary)/25 hover:scale-120
                    ${user?.currentAvatarName === avatar.iconName
                      ? 'border-(--secondary) hover:border-(--secondary) hover:bg-(--secondary)/25'
                      : 'border-(--dark-primary) hover:border-(--primary)'
                    }`}
                >
                  {avatar.icon}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
};