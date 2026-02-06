export interface RewardResponse {
  id: number
  title: string
  description: string
	price: number
	status: string
}

export interface RewardCreateRequest {
  title: string
  description: string
  likeLevel: number
}

export interface RewardEditRequest {
  title: string
  description: string
}