import { ChangePasswordRequest, UserCreateRequest, UserResponse, UserUpdateRequest } from "@/src/types/user";
import { api } from "./api";

export const getAuthenticatedUser = () => {
  return api.get<UserResponse>('/users/profile');
}

export const registerUser = (request: UserCreateRequest) => {
  return api.post('/users/register', request);
}

export const selectAvatar = (avatarName: string) => {
  return api.patch('/users/avatar/' + avatarName);
}