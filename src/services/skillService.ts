import { SkillRequest, SkillResponse } from "@/src/types/skill";
import { api } from "./api";

export const getAllSkillsByUser = (userId: number) => {
  return api.get<SkillResponse[]>('/skills/user/' + userId);
}

export const registerSkill = (request: SkillRequest) => {
  return api.post('/skills/register', request);
}

export const editSkill = (request: SkillRequest, skillId: number) => {
  return api.put('/skills/' + skillId);
}