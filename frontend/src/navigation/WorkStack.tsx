import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkProfile from "../screen/WorkProfile";
import WorkApply from "../screen/WorkApply";
import WorkNotifications from "../screen/WorkNotifications";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { WorkStackParamList } from "./types";
import WorkHomepage from "../screen/WorkHomePage";

const Stack = createNativeStackNavigator<WorkStackParamList>();

type WorkHomeRouteProps = NativeStackScreenProps<
  WorkStackParamList,
  "WorkHome"
>;
type WorkApplyRouteProps = NativeStackScreenProps<
  WorkStackParamList,
  "WorkApply"
>;
type WorkProfileRouteProps = NativeStackScreenProps<
  WorkStackParamList,
  "WorkProfile"
>;

type WorkNotificationsRouteProps = NativeStackScreenProps<
  WorkStackParamList,
  "WorkNotifications"
>;

function WorkHomeRoute({ navigation }: WorkHomeRouteProps) {
  return (
    <WorkHomepage
      onViewDetails={(vacancyId) =>
        navigation.navigate("WorkApply", { vacancyId })
      }
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
    />
  );
}

function WorkApplyRoute({ navigation, route }: WorkApplyRouteProps) {
  return (
    <WorkApply
      vacancyId={route.params?.vacancyId ?? 0}
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateApply={() => navigation.navigate("WorkApply", { vacancyId: 0 })}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
    />
  );
}

function WorkProfileRoute({ navigation }: WorkProfileRouteProps) {
  return (
    <WorkProfile
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
    />
  );
}

function WorkNotificationsRoute({ navigation }: WorkNotificationsRouteProps) {
  return (
    <WorkNotifications
      onNavigateHome={() => navigation.navigate("WorkHome")}
      onNavigateNotifications={() => navigation.navigate("WorkNotifications")}
      onNavigateProfile={() => navigation.navigate("WorkProfile")}
    />
  );
}

export default function WorkStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkHome" component={WorkHomeRoute} />
      <Stack.Screen name="WorkApply" component={WorkApplyRoute} />
      <Stack.Screen
        name="WorkNotifications"
        component={WorkNotificationsRoute}
      />
      <Stack.Screen name="WorkProfile" component={WorkProfileRoute} />
    </Stack.Navigator>
  );
}
