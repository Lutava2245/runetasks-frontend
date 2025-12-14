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
import { Coins, ShoppingBag, Gift, Sparkles, CoinsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Store = () => {
  const { user, refreshUser } = useAuth();
  const { rewards, refreshRewards } = useRewards();
  const { avatars, refreshAvatars } = useAvatars();

  const [availableRewards, setAvailableRewards] = useState<RewardResponse[]>(() => rewards.filter(r => r.status !== "claimed"));
  const [claimedRewards, setClaimedRewards] = useState<RewardResponse[]>(() => rewards.filter(r => r.status === "claimed"));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAvailableRewards(rewards.filter(r => r.status !== "claimed"));
    setClaimedRewards(rewards.filter(r => r.status === "claimed"));
    refreshRewards();
    refreshUser();
  }, [rewards])

  const handleClaim = async (rewardId: number) => {
    const reward = rewards.find(r => r.id === rewardId);

    if (user?.totalCoins ?? 0 >= (reward?.price ?? 0)) {
      await buyReward(rewardId);
      await refreshRewards();

      toast.success(`Recompensa resgatada! -${reward?.price} moedas ${<CoinsIcon />}`);
    } else {
      toast.error("Moedas insuficientes!");
    }
  };

  const handleBuyCosmetic = async (avatar: typeof avatars[0]) => {
    if (avatar.owned) {
      toast.info("Você já possui este cosmético!");
      return;
    }
    if (user?.totalCoins ?? 0 < avatar.price) {
      toast.error("Moedas insuficientes!");
      return;
    }

    try {
      await buyAvatar(avatar.id);
      await refreshUser();
      await refreshAvatars();

      toast.success(`${avatar.title} adquirido!`);
    } catch (error) {
      toast.error("Ocorreu um erro ao comprar avatar.");
      console.error(error);
    }
  };

  const handleEquipCosmetic = async (avatar: AvatarResponse) => {
    if (user) {
      if (user?.currentAvatarName !== avatar.iconName) {
        user.currentAvatarName = avatar.iconName;
        user.currentAvatarIcon = avatar.icon;

        await selectAvatar(avatar.iconName);
        await refreshUser();
        await refreshAvatars();
        toast.success("Cosmético equipado!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="mystic-glow">⭐ Recompensas</span>
            </h2>
            <p className="text-muted-foreground text-xs">Troque moedas por prêmios</p>
          </div>

          <div className="flex items-center gap-3">
            <Card className="p-3 pixel-corners border-2 border-primary/40 bg-primary/10">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg mystic-glow">{user?.totalCoins}</span>
              </div>
            </Card>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="text-base py-1.5 px-4"
            >
              Criar
            </Button>
          </div>
        </div>
        <div>
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Disponíveis ({availableRewards.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className={`p-4 bg-card border-2 transition-all pixel-corners ${reward.status !== "expensive"
                    ? 'border-primary/30 hover:border-primary/50'
                    : 'border-border/30 opacity-60'
                    }`}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-10 h-10 bg-primary/20 flex items-center justify-center pixel-corners">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground mb-1">{reward.title}</h4>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-foreground">{reward.price}</span>
                    </div>
                    <Button
                      variant={reward.status !== "expensive" ? "secondary" : "outline"}
                      disabled={reward.status === "expensive"}
                      onClick={() => handleClaim(reward.id)}
                      className="text-xs"
                    >
                      {reward.status !== "expensive" ? "Resgatar" : "$$"}
                    </Button>
                  </div>
                </Card>
              ))}

              {availableRewards.length === 0 && (
                <Card className="col-span-full p-8 bg-card border-2 border-dashed border-border/50 text-center pixel-corners">
                  <Gift className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-xs">Nenhuma recompensa. Crie!</p>
                </Card>
              )}
            </div>
          </div>

          {claimedRewards.length > 0 && (
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                Resgatadas ({claimedRewards.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {claimedRewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="p-4 bg-card/50 border-2 border-secondary/20 pixel-corners"
                  >
                    <div className="flex items-start gap-2 mb-3 opacity-60">
                      <div className="w-10 h-10 bg-secondary/20 flex items-center justify-center pixel-corners">
                        <Gift className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground mb-1">{reward.title}</h4>
                        <p className="text-xs text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <Badge variant="secondary" className="w-full justify-center text-xs">
                        <Sparkles className="w-2 h-2 mr-1" />
                        Resgatada
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Card className="relative p-4 bg-card border-2 border-secondary/30 pixel-corners overflow-hidden">
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-10 bg-contain bg-no-repeat"
          />
          <h3 className="text-sm font-bold mb-3 text-secondary relative">🏪 Loja de Cosméticos</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto relative">
            {avatars.sort((a, b) => {
                if (a.owned === b.owned) return 0;
                if (a.owned) return -1;
                return 1;
              }).map((avatar) => {
                return (
                  <div
                    key={avatar.id}
                    className={`flex items-center justify-between p-2 pixel-corners border transition-all ${avatar.owned
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-background/50 border-border/30 hover:border-secondary/50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{avatar.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-foreground">{avatar.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {avatar.owned ? '✅ Adquirido' : `${avatar.price} moedas`}
                        </p>
                      </div>
                    </div>
                    {!avatar.owned && (
                      <Button
                        variant={(user?.totalCoins ?? 0) >= avatar.price ? "secondary" : "outline"}
                        className="text-xs h-7"
                        onClick={() => handleBuyCosmetic(avatar)}
                        disabled={(user?.totalCoins ?? 0) < avatar.price}
                      >
                        Comprar
                      </Button>
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
      </div>
      <RewardFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Store;