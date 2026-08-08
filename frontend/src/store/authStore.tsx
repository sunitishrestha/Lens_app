import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, User } from '../api/auth';

type AuthStore = {
  accessToken: string | null;
  user: User | null;
  signIn: (session: AuthResponse) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthStore | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(null);

  const value = useMemo<AuthStore>(() => ({
    accessToken: session?.access_token ?? null,
    user: session?.user ?? null,
    signIn: setSession,
    signOut: () => setSession(null),
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthStore {
  const store = useContext(AuthContext);
  if (!store) throw new Error('useAuth must be used inside AuthProvider.');
  return store;
}
