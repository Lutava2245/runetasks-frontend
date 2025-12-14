export interface UserResponse {
  id: number
  name: string
  nickname: string,
  email: string
  currentAvatarIcon: string
  currentAvatarName: string
  level: number
  xpToNextLevel: number
  levelPercentage: number
  progressXP: number
  totalXP: number
  totalCoins: number
  createdAt: Date
};

export interface UserCreateRequest {
  name: string
  nickname: string
  password: string
  email: string
}

export interface UserUpdateRequest {
  name: string
}

export interface ChangePasswordRequest {
  newPassword: string
}