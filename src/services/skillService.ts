import { SkillResponse } from "@/src/types/skill";
import { api } from "./api";

export const getAllSkillsByUser = (userId: number) => {
  return api.get<SkillResponse[]>('/skills/user/' + userId);
}