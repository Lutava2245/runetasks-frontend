export interface LoginResponse {
  jwtToken: string
};

export interface LoginRequest {
  username: string,
  password: string
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}