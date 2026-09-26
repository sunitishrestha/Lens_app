import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HireHomePage from "../screen/HireHomePage";
import HireProfile from "../screen/HireProfile";
import HirePostEvent from "../screen/HirePostEvent";
import HireJobApplicant from "../screen/HireJobapplicant";
import { useAuthStore } from "../store/authStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HireStackParamList } from "./types";
import WorkerProfileView from "../screen/WorkerProfileView";

const Stack = createNativeStackNavigator<HireStackParamList>();

type HireScreenProps = NativeStackScreenProps<HireStackParamList>;
type HireApplicantsRouteProps = {
  route: { params: { vacancyId: number } };
};

function HireHomeRoute({ navigation }: HireScreenProps) {
  return (
    <HireHomePage
      onNavigateHome={() => navigation.navigate("HireHome")}
      onNavigatePost={() => navigation.navigate("HirePost")}
      onNavigateProfile={() => navigation.navigate("HireProfile")}
      onViewApplicants={(vacancyId) =>
        navigation.navigate("HireApplicants", { vacancyId })
      }
    />
  );
}

function HirePostRoute({ navigation }: HireScreenProps) {
  return (
    <HirePostEvent
      onCancel={() => navigation.navigate("HireHome")}
      onPosted={() => navigation.navigate("HireHome")}
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

function HireApplicantsRoute({
  navigation,
  route,
}: HireScreenProps & HireApplicantsRouteProps) {
  return (
    <HireJobApplicant
      vacancyId={route.params.vacancyId}
      onViewProfile={(applicantId) =>
        navigation.navigate("WorkerProfileView", { applicantId })
      }
    />
  );
}

function WorkerProfileRoute({
  navigation,
  route,
}: NativeStackScreenProps<HireStackParamList, "WorkerProfileView">) {
  return (
    <WorkerProfileView
      applicantId={route.params.applicantId}
      onBack={() => navigation.goBack()}
    />
  );
}

export default function HireStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HireHome" component={HireHomeRoute} />
      <Stack.Screen name="HirePost" component={HirePostRoute} />
      <Stack.Screen name="HireProfile" component={HireProfileRoute} />
      <Stack.Screen name="HireApplicants" component={HireApplicantsRoute} />
      <Stack.Screen name="WorkerProfileView" component={WorkerProfileRoute} />
    </Stack.Navigator>
  );
}
