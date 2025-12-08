export interface LoginResponse {
  jwtToken: string
};

export interface LoginRequest {
  username: string,
  password: string
};
