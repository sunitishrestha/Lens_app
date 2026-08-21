import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkHomePage from "../screen/WorkHomePage";
import WorkProfile from "../screen/WorkProfile";
import WorkApply from "../screen/WorkApply";
import { useAuthStore } from "../store/authStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { WorkStackParamList } from "./types";

const Stack = createNativeStackNavigator<WorkStackParamList>();

type WorkScreenProps = NativeStackScreenProps<WorkStackParamList>;

function WorkHomeRoute({ navigation }: WorkScreenProps) {
  return (
    <WorkHomePage
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateApply={() => navigation.navigate("Apply")}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
    />
  );
}

function WorkApplyRoute({ navigation }: WorkScreenProps) {
  return (
    <WorkApply
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateApply={() => navigation.navigate("Apply")}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
    />
  );
}

function WorkProfileRoute({ navigation }: WorkScreenProps) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <WorkProfile
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateApply={() => navigation.navigate("Apply")}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
      onLogout={logout}
    />
  );
}

export default function WorkStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkHome" component={WorkHomeRoute} />
      <Stack.Screen name="Apply" component={WorkApplyRoute} />
      <Stack.Screen name="WorkProfile" component={WorkProfileRoute} />
    </Stack.Navigator>
  );
}
