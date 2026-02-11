import { RewardCreateRequest, RewardEditRequest, RewardResponse } from "@/src/types/reward"
import { api } from "./api"

export const getAllRewardsByUser = (userId: number) => {
  return api.get<RewardResponse[]>('/rewards/user/' + userId);
}

export const registerReward = (request: RewardCreateRequest) => {
  return api.post('/rewards/register', request);
}

export const editReward = (request: RewardEditRequest, rewardId: number) => {
  return api.put('/rewards/' + rewardId, request);
}

export const deleteReward = (rewardId: number) => {
  return api.delete('/rewards/' + rewardId);
}