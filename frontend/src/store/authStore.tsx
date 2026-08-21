// authStore.tsx
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { getCurrentUser, User, AuthResponse } from "../api/auth";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (response: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  login: async (response) => {
    await SecureStore.setItemAsync("access_token", response.access_token);
    set({ user: response.user, accessToken: response.access_token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("access_token");
    set({ user: null, accessToken: null });
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const user = await getCurrentUser(token);
      set({ user, accessToken: token, isLoading: false });
    } catch {
      await SecureStore.deleteItemAsync("access_token");
      set({ user: null, accessToken: null, isLoading: false });
    }
  },
}));
