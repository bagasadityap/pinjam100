export interface LoginRequest {
  identityNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  identityNumber: string;
  role: string | null;
  permissions: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
