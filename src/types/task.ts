export interface TaskResponse {
  id: number
  title: string
  description: string
  status: string
  block: boolean
  taskXP: number
  taskCoins: number
  skillName: string
  date: Date
  repeatType: string
}

export interface TaskCreateRequest {
  title: string
  description: string
  difficulty: string
  skillName: string
  date: Date
  repeatType: string
}

export interface TaskEditRequest {
  title: string
  description: string
  date: Date
  repeatType: string
}