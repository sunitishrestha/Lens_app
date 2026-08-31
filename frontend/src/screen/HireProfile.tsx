import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import { myVacancies, Vacancy } from "../api/vacancies";

interface HireProfileScreenProps {
  onNavigateHome?: () => void;
  onNavigatePost?: () => void;
  onNavigateProfile?: () => void;
  onLogout?: () => void;
}

export default function HireProfileScreen({
  onNavigateHome,
  onNavigatePost,
  onNavigateProfile,
  onLogout,
}: HireProfileScreenProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    myVacancies().then(setVacancies).catch(console.log);
  }, []);

  const avatarUri =
    user?.avatar_url ?? "https://randomuser.me/api/portraits/men/12.jpg";
  const bio =
    user?.bio ?? "Add a studio bio to tell workers about your projects.";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="videocam" size={20} color={COLORS.accent} />
            <Text style={styles.logoText}>LENSLEASE</Text>
          </View>
          <TouchableOpacity>
            <Feather name="menu" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarBlock}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={COLORS.accent}
              />
            </View>
          </View>

          <Text style={styles.name}>{user?.full_name || "Your Name"}</Text>
          <Text style={styles.roleText}>
            {user?.role === "hire" ? "Hire" : "Work"}
          </Text>

          <View style={styles.skillsRow}>
            {user?.skills?.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.cardText}>{bio}</Text>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.orange} />
            <Text style={styles.cardHeaderText}> Upcoming Projects</Text>
          </View>
          {vacancies.length === 0 ? (
            <Text style={styles.listSub}>You haven't posted any jobs yet.</Text>
          ) : (
            vacancies.slice(0, 3).map((v) => (
              <View key={v.id} style={styles.listItem}>
                <Text style={styles.listTitle}>{v.title}</Text>
                <Text style={styles.listSub}>
                  {v.applicant_count} applicant
                  {v.applicant_count === 1 ? "" : "s"}
                </Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color={COLORS.textPrimary}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label="Home" onPress={onNavigateHome} />
        <TabItem
          icon="add-circle-outline"
          label="Post"
          onPress={onNavigatePost}
        />
        <TabItem
          icon="person"
          label="Profile"
          active
          onPress={onNavigateProfile}
        />
      </View>
    </View>
  );
}

interface TabItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}

function TabItem({ icon, label, active, onPress }: TabItemProps) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? COLORS.accent : COLORS.textSecondary}
      />
      <Text style={[styles.tabLabel, active && { color: COLORS.accent }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: 55,
    paddingBottom: SPACING.md,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoText: {
    color: COLORS.accent,
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  avatarBlock: {
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: 8,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 20 },
  verifiedBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 14,
  },
  roleText: { color: COLORS.textSecondary, fontSize: 14, marginTop: 8 },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  skillPill: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  skillPillText: { color: COLORS.textPrimary, fontSize: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardHeaderText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  cardText: { color: COLORS.textSecondary, lineHeight: 20 },
  listItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  listTitle: { color: COLORS.textPrimary, fontWeight: "600" },
  listSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  logoutText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginLeft: 8,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 8,
    paddingBottom: 16,
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
});
