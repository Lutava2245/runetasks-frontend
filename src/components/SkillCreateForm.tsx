import { useState } from "react";
import { toast } from "sonner";
import { useSkills } from "../contexts/SkillContext";
import { registerSkill } from "../services/skillService";
import { SkillRequest } from "../types/skill";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import { Users, Briefcase, GraduationCap, Home, Heart, Dumbbell, Landmark, ShoppingBag, Plane, Lightbulb } from "lucide-react";

interface SkillCreateFormProps {
  onClose: () => void;
}

export default function SkillCreateForm({ onClose }: SkillCreateFormProps) {
  const { refreshSkills } = useSkills();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const skillIcons = [
    { id: 1, value: "personal", title: "Pessoal", icon: <Users className="h-full w-full text-foreground" /> },
    { id: 2, value: "work", title: "Trabalho", icon: <Briefcase className="h-full w-full text-foreground" /> },
    { id: 3, value: "study", title: "Estudos", icon: <GraduationCap className="h-full w-full text-foreground" /> },
    { id: 4, value: "home", title: "Casa", icon: <Home className="h-full w-full text-foreground" /> },
    { id: 5, value: "health", title: "Vida", icon: <Heart className="h-full w-full text-foreground" /> },
    { id: 6, value: "exercise", title: "Treino", icon: <Dumbbell className="h-full w-full text-foreground" /> },
    { id: 7, value: "money", title: "Finanças", icon: <Landmark className="h-full w-full text-foreground" /> },
    { id: 8, value: "shopping", title: "Compras", icon: <ShoppingBag className="h-full w-full text-foreground" /> },
    { id: 9, value: "travel", title: "Viagens", icon: <Plane className="h-full w-full text-foreground" /> },
    { id: 10, value: "idea", title: "Ideias", icon: <Lightbulb className="h-full w-full text-foreground" /> }
  ]

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) {
      toast.info("Preencha os campos necessários para cadastrar");
      return;
    }

    const newSkill: SkillRequest = { name, icon }

    try {
      const response = await registerSkill(newSkill);
      if (response.status === 201) {
        toast.success("Habilidade criada com sucesso!");
        await refreshSkills();

        onClose();
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro ao criar habilidade");
      console.error(error);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleCreateSkill}>
      <FormField
        id="name"
        label="Nome da Habilidade"
        value={name}
        placeholder="Digite o nome"
        onChange={e => setName(e.target.value)}
        required
      />

      <div>
        <label
          htmlFor="icon"
          className={`text-sm font-medium`}
        >
          Ícone da Habilidade
        </label>

        <div className="text-center">
          {skillIcons.map((i) => (
            <Button
              id="icon"
              key={i.id}
              type="button"
              title={i.value}
              onClick={() => setIcon(i.value)}
              className={`
                border-2 w-16 h-16 text-xl m-2
                bg-background hover:bg-(--dark-primary)/25 hover:scale-120
                ${icon === i.value
                  ? 'border-(--secondary) hover:border-(--secondary) hover:bg-(--secondary)/25'
                  : 'border-(--dark-primary) hover:border-(--primary)'
                }
              `}
            >
              {i.icon}
            </Button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full text-xs mt-1">
        Salvar Habilidade
      </Button>
    </form>
  )
}