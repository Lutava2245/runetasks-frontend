import { TaskCreateRequest, TaskEditRequest, TaskResponse } from "@/src/types/task";
import { api } from "./api";

export const getAllTasksByUser = (userId: number) => {
  return api.get<TaskResponse[]>('/tasks/user/' + userId);
}

export const registerTask = (request: TaskCreateRequest) => {
  return api.post('/tasks/register', request)
}

export const editTask = (request: TaskEditRequest, taskId: number) => {
  return api.put('/tasks/' + taskId, request)
}