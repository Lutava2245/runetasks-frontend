import { useState } from "react";
import { toast } from "sonner";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import { useTasks } from "../contexts/TaskContext";
import { TaskEditRequest, TaskResponse } from "../types/task";
import { editTask } from "../services/taskService";

interface TaskEditFormProps {
  onClose: () => void;
  task: TaskResponse | null;
}

export default function TaskEditForm({ onClose, task }: TaskEditFormProps) {
  const { refreshTasks } = useTasks();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Precisa modificar o título.");
      return;
    }

    const newTask: TaskEditRequest = {
      title,
      description
    }

    if (task) {
      try {
        const response = await editTask(newTask, task.id);

        if (response.status === 204) {
          toast.success("Tarefa salva com sucesso!");
          await refreshTasks();
          onClose();
        }
      } catch (error) {
        toast.error("Erro ao salvar tarefa. Tente novamente.");
        console.error(error);
      }
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleEditTask}>
      <FormField
        id="title"
        label="Título"
        value={title}
        placeholder="Digite o título"
        defaultValue={task?.title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <FormField
        id="description"
        label="Descrição"
        value={description}
        placeholder="Digite a descrição"
        defaultValue={task?.description}
        onChange={e => setDescription(e.target.value)}
      />

      <Button type="submit" className="w-full text-xs">
        Editar Tarefa
      </Button>
    </form>
  );
}