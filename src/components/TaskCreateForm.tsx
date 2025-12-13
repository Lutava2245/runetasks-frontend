import { useState } from "react";
import { toast } from "sonner";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import Select from "./ui/Select";
import Slider from "./ui/Slider";
import { TaskCreateRequest } from "../types/task";
import { registerTask } from "../services/taskService";
import { useTasks } from "../contexts/TaskContext";
import { useSkills } from "../contexts/SkillContext";

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

  const skillOptions = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    value: skill.name
  }));

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
    if (!title || !difficulty || !skillName ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const newTask: TaskCreateRequest = {
      title,
      description,
      difficulty: switchDifficulty(difficulty),
      skillName
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

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Habilidade</label>
        <Select
          value={skillName}
          onValueChange={setSkillName}
          options={skillOptions}
          placeholder="Selecione"
          className="bg-gray-50 border-gray-400 text-xs"
        />
        </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Dificuldade
        </label>
        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg border">
          <Slider
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            max={3}
            min={1}
            step={1}
            className="flex-1"
          />
          <Badge className="w-10 justify-center">
            {difficulty}
          </Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Dificuldade: <span className="text-primary font-bold">{switchDifficulty(difficulty)}</span>
      </p>

      <Button type="submit" className="w-full text-xs">
        Criar Tarefa
      </Button>
    </form>
  )
}