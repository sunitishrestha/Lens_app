import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "../store/authStore";
import AuthStack from "./AuthStack";
import HireStack from "./HireStack";
import WorkStack from "./WorkStack";

export default function AppNavigator() {
  const user = useAuthStore((s) => s.user);

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === "hire" ? (
        <HireStack />
      ) : (
        <WorkStack />
      )}
    </NavigationContainer>
  );
}
