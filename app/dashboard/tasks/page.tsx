'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import TaskModal from "@/src/components/TaskModal";
import { completeTask, blockTask, deleteTask } from "@/src/services/taskService";
import { TaskResponse } from "@/src/types/task";
import { Circle, Lock, Unlock, CheckCircle, Trash2, Pencil, Check, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/src/utils/date";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "next/link";
import useTasks from "@/src/hooks/useTasks";
import useSkills from "@/src/hooks/useSkills";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CelebrationModal } from "@/src/components/ui/CelebrationModal";

const Tasks = () => {
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useTasks();
  const { data: skills = [] } = useSkills();
  const { user, refreshUser } = useAuth();

  const pendingTasks = tasks.filter(t => t.status !== "COMPLETED");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED");

  const [isPendingOpen, setIsPendingOpen] = useState(true);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [targetTask, setTargetTask] = useState<TaskResponse | null>(null);

  const [showVictory, setShowVictory] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ title: '', desc: '' });

  const handleComplete = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.status === "COMPLETED") {
      toast.info("Você já concluiu esta tarefa!");
    }

    try {
      const response = await completeTask(taskId);
      if (response.status === 204) {
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['skills', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['rewards', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['avatars', user?.id] });
        refreshUser();

        const difficulty = task?.taskXp === 20 ? "fácil" : (task?.taskXp === 30 ? "mediana" : "difícil");
        setCelebrationData({
          title: "Tarefa Concluída!",
          desc: `Concluíu uma tarefa ${difficulty}. Você ganhou +${task?.taskXp || 0} de XP e +${(task?.taskXp || 0) / 2} moedas!`
        });
        setShowVictory(true);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error("Não foi possível encontrar tarefa")
      } else if (error?.response?.status === 409) {
        toast.info("Você já concluiu esta tarefa!");
      } else {
        toast.error("Ocorreu um erro ao concluir tarefa")
      }
      console.error(error);
    }
  };

  const handleToggleLock = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);

    try {
      const response = await blockTask(taskId);
      if (response.status === 204) {
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });

        toast.info(task?.status === "BLOCKED" ? "Tarefa desbloqueada" : "Tarefa bloqueada");
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error("Não foi possível encontrar tarefa")
      } else if (error?.response?.status === 409) {
        toast.info("Você já concluiu esta tarefa!");
      } else {
        toast.error("Ocorreu um erro ao bloquear/desbloquear tarefa")
      }
      console.error(error);
    }
  };

  const toggleCreate = () => {
    setFormType("create");
    setIsModalOpen(true);
  }

  const toggleEdit = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    setFormType("edit");
    setTargetTask(task || null);
    setIsModalOpen(true);
  }

  const handleDelete = async (taskId: number) => {
    try {
      const response = await deleteTask(taskId);
      if (response.status === 204) {
        toast.info("Tarefa excluída");
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error("Não foi possível encontrar tarefa")
      } else if (error?.response?.status === 412) {
        toast.info("A tarefa está bloqueada");
      } else {
        toast.error("Ocorreu um erro ao excluir tarefa")
      }
      console.error(error);
    }
  };

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Tarefas</h2>
          <p className="text-sm">Organize suas tarefas e ganhe XP</p>
        </div>
        <Button
          onClick={toggleCreate}
          className="py-1.5 px-4"
          disabled={skills.length == 0}
        >
          Criar
        </Button>
      </div>

      <div className="mb-6">
        <h3
          className="h-10 text-sm font-bold mb-3 flex items-center gap-2 cursor-pointer rounded-lg p-1 hover:bg-gray-500/10 transition-all"
          onClick={() => setIsPendingOpen(!isPendingOpen)}
        >
          <ChevronDown className={`w-5 h-5 ml-1 transition-transform duration-300 ${isPendingOpen && "-rotate-90"}`} />
          <Circle className="w-4 h-4 text-(--primary)" />
          Pendentes ({pendingTasks.length})
        </h3>
        <div className={clsx(
          "grid gap-3 transition-all duration-300 ease-in-out origin-top",
          isPendingOpen
            ? "opacity-100 translate-y-0 h-auto"
            : "opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none"
        )}>
          {pendingTasks.map((task) => (
            <Card key={task.id} className="border-2 hover:border-(--primary)/30 transition-all flex flex-col md:flex-row md:justify-between">
              <div className="flex flex-col md:items-start mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-bold">{task.title}</h4>
                  {task.status === "BLOCKED" && (
                    <Lock className="w-3 h-3" />
                  )}
                  <Badge className="text-xs">
                    {task.taskXp === 20 && "Fácil"}
                    {task.taskXp === 30 && "Médio"}
                    {task.taskXp === 50 && "Difícil"}
                  </Badge>
                  <Badge className="border-(--secondary) text-(--secondary)">
                    {formatDate(task.date)}
                  </Badge>
                </div>
                <p className="text-xs mb-2">{task.description || null}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold">{task.skillName}</span>
                  <span className="text-(--secondary) font-bold">+{task.taskXp} Xp</span>
                </div>
              </div>
              <div className="flex gap-1 self-center md:self-auto">
                <Button
                  variant="outline"
                  onClick={() => handleToggleLock(task.id)}
                >
                  {task.status === "BLOCKED" ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={() => handleComplete(task.id)}
                >
                  <Check className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleEdit(task.id)}
                  disabled={task.status === "BLOCKED"}
                >
                  <Pencil className="w-5 h-5" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(task.id)}
                  disabled={task.status === "BLOCKED"}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
          {pendingTasks.length === 0 && (
            <Card className="p-8 border-2 border-dashed text-center ">
              <p className="text-sm">Nenhuma tarefa pendente.
                {skills.length !== 0
                  ? <span onClick={toggleCreate} className="text-sm text-(--secondary) cursor-pointer"> Crie uma!</span>
                  : <span className="text-sm text-(--secondary) cursor-pointer">
                    <Link href={'/dashboard/skills'} className="text-sm text-(--secondary)"> Crie uma habilidade para começar!</Link>
                  </span>
                }</p>
            </Card>
          )}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div>
          <h3
            className="h-10 text-sm font-bold mb-3 flex items-center gap-2 cursor-pointer rounded-lg p-1 hover:bg-gray-500/10 transition-all"
            onClick={() => setIsCompletedOpen(!isCompletedOpen)}
          >
            <ChevronDown className={`w-5 h-5 ml-1 transition-transform duration-300 ${isCompletedOpen && "-rotate-90"}`} />
            <CheckCircle className="w-4 h-4 text-(--secondary)" />
            Concluídas ({completedTasks.length})
          </h3>
          <div className={clsx(
            "grid gap-3 transition-all duration-300 ease-in-out origin-top",
            isCompletedOpen
              ? "opacity-100 translate-y-0 h-auto"
              : "opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none"
          )}>
            {completedTasks.map((task) => (
              <Card key={task.id} className="border-2 flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col md:items-start mb-4 md:mb-0 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold">{task.title}</h4>
                    <Badge className="border-(--primary) text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      OK
                    </Badge>
                  </div>
                  <p className="text-xs mb-2">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold">{task.skillName}</span>
                    <span className="text-(--secondary) font-bold">+{task.taskXp} XP</span>
                  </div>
                </div>
                <div className="flex gap-1 self-center md:self-auto">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType={formType}
        task={targetTask}
      />
      <CelebrationModal
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
        title={celebrationData.title}
        description={celebrationData.desc}
      />
    </div>
  );
};

export default Tasks;