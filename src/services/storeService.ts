import { AvatarResponse } from "@/src/types/avatar"
import { api } from "./api";

export const getAllAvatars = () => {
  return api.get<AvatarResponse[]>('store/avatars');
}

export const buyAvatar = (avatarId: number) => {
  return api.patch('store/buy/avatar/' + avatarId);
}

export const buyReward = (rewardId: number) => {
  return api.patch('store/buy/reward/' + rewardId);
}