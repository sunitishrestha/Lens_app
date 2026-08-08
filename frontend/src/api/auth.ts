import { apiRequest } from "./client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
  role: "hire" | "work";
};

export type User = {
  id: number;
  full_name: string;
  email: string;
  role: "hire" | "work";
};
export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: User;
};

export const loginUser = (payload: LoginPayload) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const registerUser = (payload: RegisterPayload) =>
  apiRequest<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const getCurrentUser = (accessToken: string) =>
  apiRequest<User>("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
