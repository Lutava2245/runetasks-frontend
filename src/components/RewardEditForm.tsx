import { useState } from "react";
import { useRewards } from "../contexts/RewardContext";
import { RewardEditRequest, RewardResponse } from "../types/reward";
import { toast } from "sonner";
import { editReward } from "../services/rewardService";
import FormField from "./ui/FormField";
import Button from "./ui/Button";

interface RewardEditFormProps {
  onClose: () => void;
  reward: RewardResponse;
}

export default function RewardEditForm({ onClose, reward }: RewardEditFormProps) {
  const { refreshRewards } = useRewards();
  const [title, setTitle] = useState(reward.title);
  const [description, setDescription] = useState(reward.description);

  const handleSaveReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !description) {
      toast.error("Modifique algum campo para salvar");
      return;
    }

    const newReward: RewardEditRequest = {
      title, description
    };

    try {
      if (reward == null) {
        toast.error('Recompensa não encontrada. Tente novamente mais tarde.')
        return;
      }
      const response = await editReward(newReward, reward.id);
      if (response.status === 204) {
        toast.success("Recompensa salva com sucesso!");
      }

      await refreshRewards();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar recompensa. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSaveReward}>
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

      <Button type="submit" className="w-full text-xs mt-1">
        Criar Recompensa
      </Button>
    </form>
  )
}