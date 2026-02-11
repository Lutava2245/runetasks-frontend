import Button from "./ui/Button";
import { X } from "lucide-react";
import SkillCreateForm from "./SkillCreateForm";
import SkillEditForm from "./SkillEditForm";
import { SkillResponse } from "../types/skill";
import { deleteSkill } from "../services/skillService";
import { useSkills } from "../contexts/SkillContext";
import { toast } from "sonner";
import { useTasks } from "../contexts/TaskContext";
import Card from "./ui/Card";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: string;
  skill: SkillResponse | null;
}

export default function SkillModal({ isOpen, onClose, formType, skill }: SkillModalProps) {
  const { refreshSkills } = useSkills();
  const { refreshTasks } = useTasks();

  const handleDeleteSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skill) {
      try {
        await deleteSkill(skill.id);
        await refreshSkills();
        await refreshTasks();

        onClose();
        toast.info("Habilidade excluída.");
      } catch (error: any) {
        toast.error("Não foi possível excluir habilidade");
        console.error(error?.response?.data);
      }
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card
        className="p-8 rounded-xl w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {formType === 'create' ? 'Crie uma Habilidade' : 'Edite a Habilidade'}
          </h2>
          <Button
            variant='ghost'
            onClick={onClose}
            className="leading-none"
          >
            <X />
          </Button>
        </div>

        {
          formType === 'create'
            ? <SkillCreateForm onClose={onClose} />
            : (skill && (
              <div>
                <SkillEditForm onClose={onClose} skill={skill} />

                <div className="text-center">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteSkill}
                    className="w-full text-xs mt-2 mb-1"
                  >
                    Deletar Habilidade
                  </Button>

                  {skill.totalTasks > 0 && (
                    <p className="text-sm">
                      {"Atenção: Deletar esta habilidade apagará " + skill.totalTasks + " tarefa(s)."}
                    </p>
                  )}
                </div>
              </div>
            ))
        }
      </Card>
    </div>
  )
}