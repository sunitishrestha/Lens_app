import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../screen/LoginPage";
import RegisterPage from "../screen/RegisterPage";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
    </Stack.Navigator>
  );
}
