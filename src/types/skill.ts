export interface SkillResponse {
  id: number
  name: string
  icon: string
  level: number
  xpToNextLevel: number
  levelPercentage: number
  progressXP: number
  totalXP: number
  totalTasks: number
}

export interface SkillRequest {
  name: string
  icon: string
}