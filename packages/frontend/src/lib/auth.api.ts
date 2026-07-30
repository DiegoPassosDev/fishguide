import api from "./api";
import type { LoginDto, RegisterDto, ForgotPasswordDto, AuthResponse, User } from "@/types/auth";

export async function login(data: LoginDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function forgotPassword(data: ForgotPasswordDto): Promise<void> {
  await api.post("/auth/forgot-password", data);
}

export async function getProfile(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}
