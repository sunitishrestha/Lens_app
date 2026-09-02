import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

type AppExtra = { apiUrl?: string };

export const API_URL = (Constants.expoConfig?.extra as AppExtra | undefined)
  ?.apiUrl;
export const API_BASE_URL = API_URL?.replace(/\/api\/v1\/?$/, "") ?? "";
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL)
    throw new Error("API URL is missing. Set expo.extra.apiUrl in app.json.");

  // Automatically add Authorization header if token exists
  const token = await SecureStore.getItemAsync("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Handle expired token globally
    if (response.status === 401) {
      await SecureStore.deleteItemAsync("access_token");
      // TODO later: trigger refresh-token flow or redirect to login
    }
    const message =
      typeof body === "object" && body !== null && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return body as T;
}
