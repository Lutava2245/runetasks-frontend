import { useState } from "react";
import { toast } from "sonner";
import { registerReward } from "../services/rewardService";
import { RewardCreateRequest } from "../types/reward";
import { useRewards } from "../contexts/RewardContext";
import FormField from "./ui/FormField";
import Slider from "./ui/Slider";
import Button from "./ui/Button";

interface RewardCreateFormProps {
  onClose: () => void;
}

export default function RewardCreateForm({ onClose }: RewardCreateFormProps) {
  const { refreshRewards } = useRewards();
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
      toast.info("Preencha os campos necessários para cadastrar");
      return;
    }

    const newReward: RewardCreateRequest = { title, description, likeLevel };

    try {
      const response = await registerReward(newReward);
      if (response.status === 201) {
        toast.success("Recompensa criada com sucesso!");
        await refreshRewards();

        onClose();
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro ao criar recompensa");
      console.error(error);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleCreateReward}>
      <FormField
        id="title"
        label="Título"
        value={title}
        placeholder="Ex: Assistir filme"
        onChange={e => setTitle(e.target.value)}
        required
      />

      <FormField
        id="description"
        label="Descrição"
        value={description}
        placeholder="Descreva sua recompensa"
        onChange={e => setDescription(e.target.value)}
      />

      <Slider
        label="O quanto você gosta da recompensa?"
        value={likeLevel}
        onChange={(e) => setLikeLevel(Number(e.target.value))}
        max={5}
        min={1}
        step={1}
      />
      <p className="text-xs">
        Quanto mais gostar, maior o custo!
      </p>
      <p className="text-sm mt-2">
        Custo calculado: <span className="text-(--primary) font-bold">{calculateCost(likeLevel)} moedas</span>
      </p>

      <Button type="submit" className="w-full text-xs">
        Criar Recompensa
      </Button>
    </form>
  )
}