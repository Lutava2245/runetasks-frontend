'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import TaskModal from "@/src/components/TaskModal";
import { useTasks } from "@/src/contexts/TaskContext";
import { completeTask, blockTask, deleteTask } from "@/src/services/taskService";
import { TaskResponse } from "@/src/types/task";
import { Circle, Lock, Unlock, CheckCircle, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Tasks = () => {
  const { tasks, refreshTasks } = useTasks();

  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status !== "completed"));
  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status === "completed"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [targetTask, setTargetTask] = useState<TaskResponse | null>(null);

  useEffect(() => {
    setPendingTasks(tasks.filter(t => t.status !== "completed"));
    setCompletedTasks(tasks.filter(t => t.status === "completed"));
  }, [tasks])


  const handleComplete = async (taskId: number) => {
    await completeTask(taskId);
    await refreshTasks();

    const task = tasks.find(t => t.id === taskId);
    toast.success(`+${task?.taskXP || 0} XP`);
  };

  const handleToggleLock = async (taskId: number) => {
    await blockTask(taskId);
    await refreshTasks();

    const task = tasks.find(t => t.id === taskId);

    toast.info(task?.status === "blocked" ? "Tarefa bloqueada." : "Tarefa desbloqueada.");
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="mystic-glow">Tarefas</span>
            </h2>
            <p className="text-muted-foreground text-xs">Organize estudos e ganhe XP</p>
          </div>
          <Button
            onClick={toggleCreate}
            className="text-base py-1.5 px-4"
          >
            Criar
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Circle className="w-4 h-4 text-secondary" />
            Pendentes ({pendingTasks.length})
          </h3>
          <div className="grid gap-3">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card border-2 border-border/50 hover:border-primary/30 transition-all pixel-corners">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-bold text-foreground">{task.title}</h4>
                      {task.status === "blocked" && (
                        <Badge variant="outline" className="border-primary/50 text-xs">
                          <Lock className="w-2 h-2 mr-1" />
                          Bloq
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {task.taskXP === 20 && "Fácil"}
                        {task.taskXP === 30 && "Médio"}
                        {task.taskXP === 50 && "Difícil"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">{task.description || null}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-primary font-bold">{task.skillName}</span>
                      <span className="text-secondary font-bold">⚡ +{task.taskXP} XP</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleLock(task.id)}
                    >
                      {task.status === "blocked" ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </Button>
                    <Button
                      className="h-8 w-8 p-0"
                      onClick={() => handleComplete(task.id)}
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleEdit(task.id)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {pendingTasks.length === 0 && (
              <Card className="p-8 bg-card border-2 border-dashed border-border/50 text-center pixel-corners">
                <p className="text-muted-foreground text-xs">Nenhuma tarefa pendente</p>
              </Card>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Concluídas ({completedTasks.length})
          </h3>
          <div className="grid gap-3">
            {completedTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card/50 border-2 border-primary/20 pixel-corners">
                <div className="flex items-start justify-between gap-3 opacity-60">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-bold text-foreground line-through">{task.title}</h4>
                      <Badge variant="outline" className="border-primary text-xs">
                        <CheckCircle className="w-2 h-2 mr-1" />
                        OK
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">{task.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-primary font-bold">{task.skillName}</span>
                      <span className="text-secondary font-bold">⚡ +{task.taskXP} XP</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
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