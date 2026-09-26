import { apiRequest } from "./client";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./client";

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
  bio?: string | null;
  skills?: string[];
  avatar_url?: string | null;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: User;
};

export type ProfileUpdatePayload = {
  full_name?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
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
export const updateProfile = (payload: ProfileUpdatePayload) =>
  apiRequest<User>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const uploadAvatar = async (imageUri: string): Promise<User> => {
  const token = await SecureStore.getItemAsync("access_token");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  if (!API_URL) {
    throw new Error("API URL not configured. Check app.json settings.");
  }

  const formData = new FormData();

  // Extract file extension from URI and use it in filename
  const uriParts = imageUri.split(".");
  const ext = uriParts.length > 1 ? uriParts[uriParts.length - 1] : "jpg";
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  formData.append("file", {
    uri: imageUri,
    name: `avatar.${ext}`,
    type: mimeType,
  } as any);

  try {
    const response = await fetch(`${API_URL}/auth/me/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // NOTE: don't set Content-Type manually for FormData — fetch sets the correct multipart boundary automatically
      },
      body: formData,
    });

    // First try to parse as JSON for error details
    let body: any = {};
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      const errorMessage =
        body?.detail || `Upload failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return body as User;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network request failed. Check your internet connection.");
  }
};

export const getApplicantProfile = (applicantId: number) =>
  apiRequest<User>(`/applications/applicant/${applicantId}`);
