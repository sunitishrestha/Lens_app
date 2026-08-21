import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HireHomePage from "../screen/HireHomePage";
import HireProfile from "../screen/HireProfile";
import HirePostEvent from "../screen/HirePostEvent";
import { useAuthStore } from "../store/authStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HireStackParamList } from "./types";

const Stack = createNativeStackNavigator<HireStackParamList>();

type HireScreenProps = NativeStackScreenProps<HireStackParamList>;

function HireHomeRoute({ navigation }: HireScreenProps) {
  return (
    <HireHomePage
      onNavigateHome={() => navigation.navigate("HireHome")}
      onNavigatePost={() => navigation.navigate("HirePost")}
      onNavigateProfile={() => navigation.navigate("HireProfile")}
    />
  );
}

function HirePostRoute({ navigation }: HireScreenProps) {
  return (
    <HirePostEvent
      onNavigateHome={() => navigation.navigate("HireHome")}
      onNavigatePost={() => navigation.navigate("HirePost")}
      onNavigateProfile={() => navigation.navigate("HireProfile")}
    />
  );
}

function HireProfileRoute({ navigation }: HireScreenProps) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <HireProfile
      onNavigateHome={() => navigation.navigate("HireHome")}
      onNavigatePost={() => navigation.navigate("HirePost")}
      onNavigateProfile={() => navigation.navigate("HireProfile")}
      onLogout={logout}
    />
  );
}

export default function HireStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HireHome" component={HireHomeRoute} />
      <Stack.Screen name="HirePost" component={HirePostRoute} />
      <Stack.Screen name="HireProfile" component={HireProfileRoute} />
    </Stack.Navigator>
  );
}
