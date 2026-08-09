import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../store/authStore";
import HireHomePage from "../screen/HireHomePage";
import HirePostEvent from "../screen/HirePostEvent";
import HireProfileScreen from "../screen/HireProfile";
import LoginScreen from "../screen/LoginPage";
import RegisterScreen from "../screen/RegisterPage";
import WorkHomepage from "../screen/WorkHomePage";
import WorkApplyScreen from "../screen/WorkApply";
import WorkProfileScreen from "../screen/WorkProfile";

type PublicRoute = "login" | "register";
type HireRoute = "home" | "post" | "profile";
type WorkRoute = "home" | "apply" | "profile";

export default function AppNavigator() {
  const [publicRoute, setPublicRoute] = useState<PublicRoute>("login");
  const [hireRoute, setHireRoute] = useState<HireRoute>("home");
  const [workRoute, setWorkRoute] = useState<WorkRoute>("home");
  const { accessToken, user, signOut } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      setHireRoute("home");
      setWorkRoute("home");
    }
  }, [accessToken]);

  if (!accessToken || !user) {
    return (
      <>
        {publicRoute === "register" ? (
          <RegisterScreen onBackToLogin={() => setPublicRoute("login")} />
        ) : (
          <LoginScreen onRegister={() => setPublicRoute("register")} />
        )}
        <StatusBar style="light" />
      </>
    );
  }

  if (user.role === "hire") {
    return (
      <>
        {hireRoute === "post" ? (
          <HirePostEvent
            onCancel={() => setHireRoute("home")}
            onPostEvent={() => setHireRoute("home")}
            onNavigateHome={() => setHireRoute("home")}
            onNavigatePost={() => setHireRoute("post")}
            onNavigateProfile={() => setHireRoute("profile")}
          />
        ) : hireRoute === "profile" ? (
          <HireProfileScreen
            onNavigateHome={() => setHireRoute("home")}
            onNavigatePost={() => setHireRoute("post")}
            onNavigateProfile={() => setHireRoute("profile")}
            onLogout={() => {
              signOut();
              setHireRoute("home");
            }}
          />
        ) : (
          <HireHomePage
            onPostJob={() => setHireRoute("post")}
            onNavigateHome={() => setHireRoute("home")}
            onNavigatePost={() => setHireRoute("post")}
            onNavigateProfile={() => setHireRoute("profile")}
          />
        )}
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      {workRoute === "apply" ? (
        <WorkApplyScreen
          onCancel={() => setWorkRoute("home")}
          onSubmit={() => setWorkRoute("home")}
          onNavigateHome={() => setWorkRoute("home")}
          onNavigateApply={() => setWorkRoute("apply")}
          onNavigateProfile={() => setWorkRoute("profile")}
        />
      ) : workRoute === "profile" ? (
        <WorkProfileScreen
          onNavigateHome={() => setWorkRoute("home")}
          onNavigateApply={() => setWorkRoute("apply")}
          onNavigateProfile={() => setWorkRoute("profile")}
          onLogout={() => {
            signOut();
            setWorkRoute("home");
          }}
        />
      ) : (
        <WorkHomepage
          userName={user.full_name || "User"}
          onNavigateHome={() => setWorkRoute("home")}
          onNavigateApply={() => setWorkRoute("apply")}
          onNavigateProfile={() => setWorkRoute("profile")}
        />
      )}
      <StatusBar style="light" />
    </>
  );
}
