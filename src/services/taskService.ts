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

export const completeTask = (taskId: number) => {
  return api.patch('/tasks/' + taskId + '/complete');
}

export const blockTask = (taskId: number) => {
  return api.patch('/tasks/' + taskId + '/block');
}

export const deleteTask = (taskId: number) => {
  return api.delete('/tasks/' + taskId);
}