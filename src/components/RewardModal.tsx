'use client';

import Button from "./ui/Button";
import { useRewards } from "../contexts/RewardContext";
import { RewardResponse } from "../types/reward";
import { toast } from "sonner";
import Card from "./ui/Card";
import { X } from "lucide-react";
import { deleteReward } from "../services/rewardService";
import RewardCreateForm from "./RewardCreateForm";
import RewardEditForm from "./RewardEditForm";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: string;
  reward: RewardResponse | null;
}

export default function RewardFormModal({ isOpen, onClose, formType, reward }: RewardModalProps) {
  const { refreshRewards } = useRewards();

  const handleDeleteReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reward) {
      try {
        await deleteReward(reward.id);
        await refreshRewards();

        onClose();
        toast.info("Recompensa excluída.")
      } catch (error: any) {
        toast.error("Não foi possível excluir recompensa.");
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
            {formType === 'create' ? 'Crie uma Recompensa' : 'Edite a Recompensa'}
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
            ? <RewardCreateForm onClose={onClose} />
            : (reward && (
              <div>
                <RewardEditForm onClose={onClose} reward={reward} />
                <Button
                  variant="destructive"
                  onClick={handleDeleteReward}
                  className="w-full text-xs mt-2"
                >
                  Deletar Habilidade
                </Button>
              </div>
            ))
        }
      </Card>
    </div>
  );
}