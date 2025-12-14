export interface RewardResponse {
  id: number
  title: string
  description: string
	price: number
	status: string
}

export interface RewardRequest {
  title: string
  description: string
  likeLevel: number
}