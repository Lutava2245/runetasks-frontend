import { AvatarResponse } from "@/src/types/avatar"
import { api } from "./api";

export const getAllAvatars = () => {
  return api.get<AvatarResponse[]>('store/avatars');
}