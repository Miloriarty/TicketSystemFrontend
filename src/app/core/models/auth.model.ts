export interface LoginRequest {
  fullName: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  role: string;
}
