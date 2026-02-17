'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import RewardFormModal from "@/src/components/RewardModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAvatars } from "@/src/contexts/AvatarContext";
import { useRewards } from "@/src/contexts/RewardContext";
import { buyAvatar, buyReward } from "@/src/services/storeService";
import { selectAvatar } from "@/src/services/userService";
import { AvatarResponse } from "@/src/types/avatar";
import { RewardResponse } from "@/src/types/reward";
import { Coins, ShoppingBag, Gift, Sparkles, CoinsIcon, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Store = () => {
  const { user, refreshUser } = useAuth();
  const { rewards, refreshRewards } = useRewards();
  const { avatars, refreshAvatars } = useAvatars();

  const [availableRewards, setAvailableRewards] = useState<RewardResponse[]>(() => rewards.filter(r => r.status !== "REDEEMED"));
  const [claimedRewards, setClaimedRewards] = useState<RewardResponse[]>(() => rewards.filter(r => r.status === "REDEEMED"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [targetReward, setTargetReward] = useState<RewardResponse | null>(null);

  useEffect(() => {
    setAvailableRewards(rewards.filter(r => r.status !== "REDEEMED"));
    setClaimedRewards(rewards.filter(r => r.status === "REDEEMED"));
  }, [rewards])

  const toggleCreate = () => {
    setFormType("create");
    setIsModalOpen(true);
  }

  const toggleEdit = (skillId: number) => {
    const reward = rewards.find(s => s.id === skillId);
    setFormType("edit");
    setTargetReward(reward || null);
    setIsModalOpen(true);
  }

  const handleClaim = async (rewardId: number) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward?.status === "REDEEMED") {
      toast.info("Você já resgatou esta recompensa!");
    }

    try {
      const response = await buyReward(rewardId);
      if (response.status === 204) {
        toast.success(`Recompensa resgatada!`, { description: ` -${reward?.price} moedas` });

        await refreshRewards();
        await refreshUser();
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error("Não foi possível encontrar recompensa")
      } else if (error?.response?.status === 409) {
        toast.info("Você já resgatou esta recompensa!");
      } else if (error?.response?.status === 412) {
        toast.error("Moedas insuficientes!");
      } else {
        toast.error("Ocorreu um erro ao resgatar recompensa")
      }
      console.error(error);
    }
  }

  const handleBuyAvatar = async (avatar: typeof avatars[0]) => {
    if (avatar.owned) {
      toast.info("Você já possui este avatar!");
      return;
    }

    try {
      const response = await buyAvatar(avatar.id);
      if (response.status === 204) {
        toast.success(`${avatar.title} adquirido!`, { description: ` -${avatar?.price} moedas` });

        await refreshAvatars();
        await refreshUser();
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error("Não foi possível encontrar avatar")
      } else if (error?.response?.status === 409) {
        toast.info("Você já possui este avatar!");
      } else if (error?.response?.status === 412) {
        toast.error("Moedas insuficientes!");
      } else {
        toast.error("Ocorreu um erro ao comprar avatar.");
      }
      console.error(error);
    }
  };

  const handleEquipCosmetic = async (avatar: AvatarResponse) => {
    if (user && user.currentAvatarName !== avatar.iconName) {
      try {
        const response = await selectAvatar(avatar.iconName);
        if (response.status === 204) {
          toast.success('Avatar atualizado!')

          await refreshUser();
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          toast.error("Não foi possível encontrar avatar")
        } else {
          toast.error("Ocorreu um erro ao equipar avatar");
        }
        console.error(error);
      }
    }
  };

  return (
    <div className="mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Recompensas</h2>
          <p className=" text-sm">Resgate prêmios</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="h-10 border-2 border-(--secondary)/40 flex items-center">
            <Coins className="w-5 h-5 text-(--secondary)" />
            <span className="font-bold text-lg">{user?.totalCoins}</span>
          </Card>
          <Button
            onClick={toggleCreate}
            className="py-1.5 px-4"
          >
            Criar
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-(--primary)" />
          Disponíveis ({availableRewards.length})
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {availableRewards.map((reward) => (
            <Card
              key={reward.id}
              className={`border-2 transition-all
                ${reward.status === "EXPENSIVE"
                  ? 'hover:border-(--primary)/30 opacity-60'
                  : 'border-(--primary)/30 hover:border-(--primary)'
                }`}
            >
              <div className="flex items-start gap-2 mb-3">
                <Gift className="w-5 h-5 text-(--primary)" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold">{reward.title}</h4>
                  <p className="text-xs ">{reward.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-(--secondary)" />
                  <span className="text-lg font-bold">{reward.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={reward.status === "EXPENSIVE"}
                    onClick={() => handleClaim(reward.id)}
                    className="text-xs px-4"
                  >
                    {reward.status !== "EXPENSIVE" ? "Resgatar" : "$$$"}
                  </Button>
                  <Button
                    onClick={() => toggleEdit(reward.id)}
                    className="text-xs px-4"
                  >
                    <Pencil />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {availableRewards.length === 0 && (
          <div className="grid gap-3">
            <Card className="p-8 border-2 border-dashed text-center ">
              <p className="text-sm">Nenhuma recompensa disponível</p>
            </Card>
          </div>
        )}
      </div>

      {claimedRewards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-(--secondary)" />
            Resgatadas ({claimedRewards.length})
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {claimedRewards.map((reward) => (
              <Card key={reward.id} className="border-2 border-(--secondary)/30">
                <div className="flex items-start gap-2 mb-3 opacity-60">
                  <Gift className="w-5 h-5 text-(--secondary)" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">{reward.title}</h4>
                    <p className="text-xs ">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center opacity-60">
                  <Badge className="justify-center text-xs">
                    Resgatada
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="border-2 border-(--secondary)/30 hover:border-(--secondary) transition-all">
        <h3 className="text-sm font-bold mb-3 text-(--secondary)">Loja de Cosméticos</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {avatars.sort((a, b) => {
            if (a.owned === b.owned) return 0;
            if (a.owned) return -1;
            return 1;
          }).map((avatar) => {
            return (
              <div
                key={avatar.id}
                className={`flex items-center justify-between p-2 border-2 transition-all
                  bg-background rounded-lg
                  ${avatar.owned
                    ? (avatar.iconName === user?.currentAvatarName
                      ? 'border-(--secondary)/30'
                      : 'border-(--primary)/30')
                    : 'border-background'
                  }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-2xl">{avatar.icon}</span>
                  <p className="font-bold">{avatar.title}</p>
                </div>

                {!avatar.owned && (
                  <div className="flex items-center gap-2">
                    <Badge className={`h-8 border-(--secondary) text-(--secondary) flex items-center gap-1`}>
                      <Coins className="w-3 h-3 text-(--secondary)" />
                      {avatar.owned ? 'Adquirido' : avatar.price}
                    </Badge>

                    <Button
                      className="text-xs h-7"
                      onClick={() => handleBuyAvatar(avatar)}
                      disabled={(user?.totalCoins ?? 0) < avatar.price}
                    >
                      Comprar
                    </Button>
                  </div>
                )}
                {avatar.owned && (
                  <Button
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => handleEquipCosmetic(avatar)}
                    disabled={avatar.iconName === user?.currentAvatarName}
                  >
                    Equipar
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      <RewardFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType={formType}
        reward={targetReward}
      />
    </div>
  );
};

export default Store;