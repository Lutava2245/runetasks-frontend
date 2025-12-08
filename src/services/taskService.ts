import { TaskCreateRequest, TaskEditRequest, TaskResponse } from "@/src/types/task";
import { api } from "./api";

export const getAllTasksByUser = (userId: number) => {
  return api.get<TaskResponse[]>('/tasks/user/' + userId);
}