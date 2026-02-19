import { useState } from "react";
import { toast } from "sonner";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import { TaskEditRequest, TaskResponse } from "../types/task";
import { editTask } from "../services/taskService";
import { getDateString } from "../utils/date";
import Select from "./ui/Select";
import { DatePicker } from "./ui/DatePicker";
import { useAuth } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface TaskEditFormProps {
  onClose: () => void;
  task: TaskResponse;
}

export default function TaskEditForm({ onClose, task }: TaskEditFormProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState<string>(getDateString(task.date));
  const [repeatType, setRepeatType] = useState(task.repeatType);

  const repeatTypeOptions = [
    { id: 1, name: "Nenhuma", value: "NONE" },
    { id: 2, name: "Diária", value: "DAILY" },
    { id: 3, name: "Semanal", value: "WEEKLY" },
    { id: 4, name: "Mensal", value: "MONTHLY" },
  ];

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !description && !date && !repeatType) {
      toast.info("Preencha os campos necessários para salvar");
      return;
    }

    const [year, month, day] = date.split('-').map(Number);

    const newTask: TaskEditRequest = {
      title,
      description,
      date: new Date(year, month - 1, day),
      repeatType
    }

    try {
      const response = await editTask(newTask, task.id);
      if (response.status === 204) {
        toast.success("Tarefa salva com sucesso!");
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });

        onClose();
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.info("Você já concluiu esta tarefa!");
      } else if (error?.response?.status === 412) {
        toast.info("A tarefa está bloqueada");
      } else {
        toast.error("Ocorreu um erro ao salvar tarefa");
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
        onChange={e => setTitle(e.target.value)}
        required
      />

      <FormField
        id="description"
        label="Descrição"
        value={description}
        placeholder="Digite a descrição"
        onChange={e => setDescription(e.target.value)}
      />

      <Select
        label="Repetição"
        value={repeatType}
        onValueChange={setRepeatType}
        options={repeatTypeOptions}
      />

      <DatePicker
        label="Data"
        value={date}
        placeholder={date}
        onValueChange={(value) => setDate(value)}
        min={new Date().toISOString().split('T')[0]}
      />

      <Button type="submit" className="w-full text-xs mt-1">
        Editar Tarefa
      </Button>
    </form>
  );
}