import { useEffect } from "react";
import { useAuthStore } from "./src/store/authStore";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) return null; // or a splash screen

  return <AppNavigator />;
}
