'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import TaskModal from "@/src/components/TaskModal";
import { useTasks } from "@/src/contexts/TaskContext";
import { completeTask, blockTask, deleteTask } from "@/src/services/taskService";
import { TaskResponse } from "@/src/types/task";
import { Circle, Lock, Unlock, CheckCircle, Trash2, Pencil, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/src/utils/date";

const Tasks = () => {
  const { tasks, refreshTasks } = useTasks();

  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status !== "COMPLETED"));
  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status === "COMPLETED"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [targetTask, setTargetTask] = useState<TaskResponse | null>(null);

  useEffect(() => {
    setPendingTasks(tasks.filter(t => t.status !== "COMPLETED"));
    setCompletedTasks(tasks.filter(t => t.status === "COMPLETED"));
  }, [tasks])

  const handleComplete = async (taskId: number) => {
    await completeTask(taskId);
    await refreshTasks();

    const task = tasks.find(t => t.id === taskId);
    toast.success('Tarefa concluída!', {description: `+${task?.taskXP || 0} XP`});
  };

  const handleToggleLock = async (taskId: number) => {
    await blockTask(taskId);
    await refreshTasks();

    const task = tasks.find(t => t.id === taskId);

    toast.info(task?.status === "BLOCKED" ? "Tarefa bloqueada." : "Tarefa desbloqueada.");
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
      await deleteTask(taskId);
      await refreshTasks();
      toast.success("Tarefa excluída!");
    } catch (error: any) {
      toast.error("Não foi possível excluir tarefa.")
      console.error(error?.response?.data);
    }
  };

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between ">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Tarefas</h2>
          <p className="text-sm">Organize suas tarefas e ganhe XP</p>
        </div>
        <Button
          onClick={toggleCreate}
          className="py-1.5 px-4"
        >
          Criar
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Circle className="w-4 h-4 text-(--primary)" />
          Pendentes ({pendingTasks.length})
        </h3>
        <div className="grid gap-3">
          {pendingTasks.map((task) => (
            <Card key={task.id} className="p-4 border-2 hover:border-(--primary)/30 flex flex-col md:flex-row md:justify-between">
              <div className="flex flex-col md:items-start mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-bold">{task.title}</h4>
                  {task.status === "BLOCKED" && (
                    <Lock className="w-3 h-3" />
                  )}
                  <Badge className="text-xs">
                    {task.taskXP === 20 && "Fácil"}
                    {task.taskXP === 30 && "Médio"}
                    {task.taskXP === 50 && "Difícil"}
                  </Badge>
                  <Badge className="border-(--secondary) text-(--secondary)">
                    {formatDate(task.date)}
                  </Badge>
                </div>
                <p className="text-xs mb-2">{task.description || null}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold">{task.skillName}</span>
                  <span className="text-(--secondary) font-bold">+{task.taskXP} XP</span>
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
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
          {pendingTasks.length === 0 && (
            <Card className="p-8 bg-(--card) border-2 border-dashed /50 text-center ">
              <p className="text-sm">Nenhuma tarefa pendente</p>
            </Card>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-(--primary)" />
          Concluídas ({completedTasks.length})
        </h3>
        <div className="grid gap-3">
          {completedTasks.map((task) => (
            <Card key={task.id} className="p-4 border-2 flex flex-col md:flex-row md:justify-between">
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
                  <span className="text-(--secondary) font-bold">+{task.taskXP} XP</span>
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
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType={formType}
        task={targetTask}
      />
    </div>
  );
};

export default Tasks;