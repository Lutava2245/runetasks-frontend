'use client';

import Button from "./ui/Button";
import FormField from "./ui/FormField";
import Select from "./ui/Select";
import { useSkills } from "../contexts/SkillContext";
import { editSkill, registerSkill } from "../services/skillService";
import { SkillRequest, SkillResponse } from "../types/skill";
import { toast } from "sonner";
import { useState } from "react";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: string;
  skill: SkillResponse | null;
}

export default function SkillModal({ isOpen, onClose, formType, skill }: SkillModalProps) {
  const { refreshSkills } = useSkills();
  const [name, setName] = useState(skill?.name);
  const [icon, setIcon] = useState(skill?.icon);

  const iconOptions = [
    { "id": 1, "value": "math" },
    { "id": 2, "value": "book" },
    { "id": 3, "value": "react" },
    { "id": 4, "value": "test" },
    { "id": 5, "value": "science" },
    { "id": 6, "value": "world" },
    { "id": 7, "value": "code" },
    { "id": 8, "value": "art" },
    { "id": 9, "value": "music" },
    { "id": 10, "value": "soccer" },
    { "id": 11, "value": "run" },
    { "id": 12, "value": "notes" }
  ]

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) {
      toast.error(formType === "create" ? "Preencha todos os campos." : "Modifique algum campo para salvar");
      return;
    }

    const newSkill: SkillRequest = {
      name, icon
    }

    try {
      if (formType === "create") {
        const response = await registerSkill(newSkill);

        if (response.status === 201) {
          toast.success("Habilidade criada com sucesso!");
        }
      } else {
        if (skill == null) {
          toast.error('Habilidade não encontrada. Tente novamente mais tarde.')
          return;
        }
        const response = await editSkill(newSkill, skill.id);
        if (response.status === 204) {
          toast.success("Habilidade salva com sucesso!");
        }
      }

      await refreshSkills();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar habilidade. Tente novamente.");
      console.error(error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {formType === 'create' ? 'Crie uma Habilidade' : 'Edite a Habilidade'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">
            &times;
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSaveSkill}>
          <FormField
            id="name"
            label="Nome da Habilidade"
            value={name}
            placeholder={formType === "create" ? "Digite o nome" : skill?.name}
            onChange={e => setName(e.target.value)}
            required
          />

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Habilidade</label>
            <Select
              value={icon}
              onValueChange={setIcon}
              options={iconOptions}
              placeholder="Selecione"
              className="bg-gray-50 border-gray-400 text-xs"
            />
          </div>

          <Button type="submit" className="w-full text-xs">
            Salvar Habilidade
          </Button>
        </form>
      </div>
    </div>
  )
}