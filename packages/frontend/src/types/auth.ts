export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  privacy?: string;
  birthDate?: string | null;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  avatar?: string;
  privacy?: string;
  birthDate?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
