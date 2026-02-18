export interface SkillResponse {
  id: number
  name: string
  icon: string
  level: number
  xpToNextLevel: number
  levelPercentage: number
  progressXp: number
  totalXp: number
  totalTasks: number
}

export interface SkillRequest {
  name: string
  icon: string
}