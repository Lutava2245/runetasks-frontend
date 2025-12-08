'use client';

import Badge from "@/src/components/Badge";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Progress from "@/src/components/Progress";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAvatars } from "@/src/contexts/AvatarContext";
import { useSkills } from "@/src/contexts/SkillContext";
import { useTasks } from "@/src/contexts/TaskContext";
import { selectAvatar } from "@/src/services/userService";
import { AvatarResponse } from "@/src/types/avatar";
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
        await selectAvatar(avatar.iconName);
        await refreshUser();
        toast.success("Cosmético equipado!");
      } catch (error) {
        toast.error("Falha ao equipar cosmético.");
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="mystic-glow">Home</span>
        </h2>
        <p className="text-muted-foreground text-xs">Continue sua jornada épica de estudos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card border-2 border-primary/30 hover:border-primary/50 transition-all pixel-corners">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Nível</p>
                  <p className="text-2xl font-bold text-foreground">{user?.level}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">XP</span>
                  <span className="text-foreground font-bold">{user?.progressXP} / {user?.xpToNextLevel}</span>
                </div>
                <Progress value={user?.levelPercentage ?? 0} className="h-2" />
              </div>
            </Card>

            <Card className="p-4 bg-card border-2 border-secondary/30 hover:border-secondary/50 transition-all pixel-corners">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold text-foreground">{user?.totalXP}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="text-secondary font-bold">-{(user?.xpToNextLevel && user?.progressXP) ? user?.xpToNextLevel - user?.progressXP : 0} XP</span> próx. nível
              </p>
            </Card>

            <Card className="p-4 bg-card border-2 border-primary/30 hover:border-primary/50 transition-all pixel-corners">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Moedas</p>
                  <p className="text-2xl font-bold text-foreground">{user?.totalCoins}</p>
                </div>
              </div>
              <Link href="/rewards">
                <Button variant="secondary" className="w-full mt-3 text-xs">
                  Ver Recompensas
                </Button>
              </Link>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  Tarefas
                </h3>
                <Link href="/tasks">
                  <Button variant="secondary" className="text-xs h-6">Ver</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {tasks.sort((a, b) => {
                  if (a.status === b.status) return 0;
                  if (a.status === 'completed') return 1;
                  return -1;
                }).slice(0, 5).map((task) => {
                  const taskCompleted = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-background/50 border border-border/30 pixel-corners"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 border-2 flex items-center justify-center pixel-corners ${taskCompleted ? 'bg-primary border-primary' : 'border-border'
                          }`}>
                          {taskCompleted && <span className="text-primary-foreground text-[8px]">✓</span>}
                        </div>
                        <span className={`text-xs ${taskCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-secondary">+{task.taskXP}</span>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  Skills
                </h3>
                <Link href="/skills">
                  <Button variant="secondary" className="text-xs h-6">Ver</Button>
                </Link>
              </div>
              <div className="space-y-2">
                {skills.sort((a, b) => b.totalXP - a.totalXP)
                  .slice(0, 5).map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">Lv {skill.level}</span>
                      </div>
                      <Progress value={skill.levelPercentage} className="h-1" />
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-card border-2 border-primary/30 text-center pixel-corners relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5"></div>
            <h3 className="text-sm font-bold mb-3 text-foreground relative">👤 Seu Avatar</h3>
            <div className="relative w-24 h-24 mx-auto mb-3 text-6xl flex items-center justify-center border-4 border-primary/40 pixel-corners bg-primary/10 hover:scale-110 transition-transform">
              {user?.currentAvatarIcon}
            </div>
            <p className="text-xs text-muted-foreground mb-2 relative">{user?.nickname} - Nível {user?.level}</p>
            <Badge variant="secondary" className="text-xs relative">
              {user?.totalCoins} Moedas
            </Badge>
          </Card>

          <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
            <h3 className="text-sm font-bold mb-3 text-foreground">🎨 Meus Cosméticos</h3>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {ownedAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleEquipCosmetic(avatar)}
                  className={`p-3 text-3xl border-2 pixel-corners transition-all hover:scale-110 ${user?.currentAvatarName === avatar.iconName
                    ? 'border-primary bg-primary/20 animate-pulse'
                    : 'border-border/30 hover:border-primary/50'
                    }`}
                  title={avatar.title}
                >
                  {avatar.icon}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
};