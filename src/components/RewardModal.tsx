'use client';

import Badge from "./ui/Badge";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import Slider from "./ui/Slider";
import { useTasks } from "../contexts/TaskContext";
import { registerReward } from "../services/rewardService";
import { RewardRequest } from "../types/reward";
import { useState } from "react";
import { toast } from "sonner";

interface RewardFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardFormModal({ isOpen, onClose }: RewardFormProps) {
  const { refreshTasks } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [likeLevel, setLikeLevel] = useState(1);

  const calculateCost = (likeLevel: number): number => {
    switch (likeLevel) {
      case 2:
        return 50;

      case 3:
        return 75;

      case 4:
        return 100;

      case 5:
        return 150;

      default:
        return 30;
    }
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !likeLevel) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const newReward: RewardRequest = {
      title,
      description,
      likeLevel
    };

    try {
      const response = await registerReward(newReward);

      if (response.status === 201) {
        toast.success("Recompensa criada com sucesso!");
        await refreshTasks();
        onClose();
      }
    } catch (error) {
      toast.error("Erro ao criar recompensa. Tente novamente.");
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
            Criar Recompensa
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">
            &times;
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleCreateReward}>
          <FormField
            id="title"
            label="Título"
            value={title}
            placeholder="Ex: Assistir filme"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <FormField
            id="description"
            label="Descrição"
            value={description}
            placeholder="Descreva..."
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="mt-4">
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              O quanto você gosta? (1-5)
            </label>
            <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg border">
              <Slider
                value={likeLevel}
                onChange={(e) => setLikeLevel(Number(e.target.value))}
                max={5}
                min={1}
                step={1}
                className="flex-1"
              />
              <Badge className="w-10 justify-center">
                {likeLevel}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Custo calculado: <span className="text-primary font-bold">{calculateCost(likeLevel)} moedas</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Quanto mais gostar, maior o custo!
          </p>
          <Button type="submit" variant="primary" className="w-full text-xs">
            Criar Recompensa
          </Button>
        </form>
      </div>
    </div>
  );
}