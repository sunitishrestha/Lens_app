import Constants from 'expo-constants';

type AppExtra = { apiUrl?: string };
const API_URL = (Constants.expoConfig?.extra as AppExtra | undefined)?.apiUrl;

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new Error('API URL is missing. Set expo.extra.apiUrl in app.json.');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body: unknown = await response.json().catch(() => ({}));
  const message = typeof body === 'object' && body !== null && 'detail' in body ? String(body.detail) : 'Something went wrong. Please try again.';
  if (!response.ok) throw new Error(message);
  return body as T;
}
