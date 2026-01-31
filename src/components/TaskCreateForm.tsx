import { useState } from "react";
import { toast } from "sonner";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import Select from "./ui/Select";
import Slider from "./ui/Slider";
import { TaskCreateRequest } from "../types/task";
import { registerTask } from "../services/taskService";
import { useTasks } from "../contexts/TaskContext";
import { useSkills } from "../contexts/SkillContext";
import { DatePicker } from "./ui/DatePicker";
import { getDateString } from "../utils/date";

interface TaskCreateFormProps {
  onClose: () => void;
}

export default function TaskCreateForm({ onClose }: TaskCreateFormProps) {
  const { refreshTasks } = useTasks();
  const { skills } = useSkills();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillName, setSkillName] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [date, setDate] = useState(getDateString(new Date()));
  const [repeatType, setRepeatType] = useState("NONE");

  const skillOptions = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    value: skill.name
  }));

  const repeatTypeOptions = [
    { id: 1, name: "Nenhuma", value: "NONE" },
    { id: 2, name: "Diária", value: "DAILY" },
    { id: 3, name: "Semanal", value: "WEEKLY" },
    { id: 4, name: "Mensal", value: "MONTHLY" },
  ];

  const switchDifficulty = (difficulty: number): string => {
    switch (difficulty) {
      case 2:
        return 'medium';

      case 3:
        return 'hard';

      default:
        return 'easy';
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !difficulty || !skillName || !date || !repeatType) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const [year, month, day] = date.split('-').map(Number);

    const newTask: TaskCreateRequest = {
      title,
      description,
      difficulty: switchDifficulty(difficulty),
      skillName,
      date: new Date(year, month - 1, day),
      repeatType
    }

    try {
      const response = await registerTask(newTask);

      if (response.status === 201) {
        toast.success("Tarefa criada com sucesso!");
        await refreshTasks();
        onClose();
      }
    } catch (error) {
      toast.error("Erro ao criar tarefa. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleCreateTask}>
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
        label="Habilidade"
        value={skillName}
        onValueChange={setSkillName}
        options={skillOptions}
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

      <Slider
        label="Dificuldade"
        value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))}
        max={3}
        min={1}
        step={1}
      />
      <p className="text-xs">
        Dificuldade: <span className="text-(--primary) font-bold">
          {difficulty === 1 && "Fácil"}
          {difficulty === 2 && "Médio"}
          {difficulty === 3 && "Difícil"}
        </span>
      </p>

      <Button type="submit" className="w-full text-xs">
        Criar Tarefa
      </Button>
    </form>
  )
}