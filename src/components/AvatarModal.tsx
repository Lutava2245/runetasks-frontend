import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { selectAvatar } from "../services/userService";
import { useEffect, useState } from "react";
import { AvatarResponse } from "../types/avatar";
import { useAvatars } from "../contexts/AvatarContext";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  const { user, refreshUser } = useAuth();
  const { avatars } = useAvatars();
  const [ownedAvatars, setOwnedAvatars] = useState<AvatarResponse[]>(() => avatars.filter(a => a.owned));
  const [userAvatar, setUserAvatar] = useState<string>(user?.currentAvatarIcon || "");

  useEffect(() => {
    setOwnedAvatars(avatars.filter(a => a.owned));
  }, [avatars]);

  const handleEquipCosmetic = async (avatar: AvatarResponse) => {
    if (user) {
      if (user.currentAvatarName !== avatar.iconName) {
        user.currentAvatarName = avatar.iconName;
        user.currentAvatarIcon = avatar.icon;
        setUserAvatar(user.currentAvatarIcon);

        selectAvatar(avatar.iconName);
        await refreshUser();
        onClose();
        toast.success("Cosmético equipado!");
      }
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
        <div className="grid grid-cols-4 gap-3">
          {ownedAvatars.map((avatar) => (
            <button
              key={avatar.iconName}
              onClick={() => handleEquipCosmetic(avatar)}
              className={`p-3 text-3xl border-2 pixel-corners transition-all ${userAvatar === avatar.iconName
                ? 'border-primary bg-primary/20'
                : 'border-border/30 hover:border-primary/50'
                }`}
            >
              {avatar.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}