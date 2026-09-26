export interface UserRequest {
  identityNumber: string;
  name: string;
  password: string;
}

export interface UserResponse {
  id: string;
  identityNumber: string;
  name: string;
  status: string;
  role: string;
  branch: string;
}
