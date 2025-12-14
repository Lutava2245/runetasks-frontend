import { RewardRequest, RewardResponse } from "@/src/types/reward"
import { api } from "./api"

export const getAllRewardsByUser = (userId: number) => {
  return api.get<RewardResponse[]>('/rewards/user/' + userId);
}

export const registerReward = (request: RewardRequest) => {
  return api.post('/rewards/register', request);
}