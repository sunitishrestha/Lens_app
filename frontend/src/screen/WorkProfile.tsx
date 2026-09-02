import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "../api/auth";
import { API_BASE_URL } from "../api/client";

interface CameramanProfileScreenProps {
  onBookNow?: () => void;
  onMessage?: () => void;
  onNavigateHome?: () => void;
  onNavigateApply?: () => void;
  onNavigateProfile?: () => void;
}

export default function CameramanProfileScreen({
  onBookNow,
  onMessage,
  onNavigateHome,
  onNavigateApply,
  onNavigateProfile,
}: CameramanProfileScreenProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: logout },
    ]);
  };

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    setUploading(true);
    try {
      const updatedUser = await uploadAvatar(result.assets[0].uri);
      setUser(updatedUser);
    } catch (err) {
      Alert.alert(
        "Upload failed",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };
  const name = user?.full_name ?? "Your Name";
  const skills = user?.skills && user.skills.length > 0 ? user.skills : [];
  const avatarUri = user?.avatar_url
    ? `${API_BASE_URL}${user.avatar_url}`
    : "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
      (user?.email ?? "default");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="videocam" size={20} color={COLORS.accent} />
            <Text style={styles.logoText}>LENSLEASE</Text>
          </View>
          <TouchableOpacity>
            <Feather name="menu" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Avatar + info */}
        <View style={styles.avatarBlock}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={handlePickAvatar}
            disabled={uploading}
          >
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              {uploading ? (
                <ActivityIndicator size="small" color={COLORS.accent} />
              ) : (
                <Ionicons name="camera" size={16} color={COLORS.accent} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM MEMBER</Text>
          </View>
          <Text style={styles.roleText}>
            {user?.role === "hire" ? "Hire" : "Work"}
          </Text>

          <View style={styles.skillsRow}>
            {skills.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.bookBtn} onPress={onBookNow}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageBtn} onPress={onMessage}>
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Equipment card */}
        {/* Equipment card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="aperture-outline" size={18} color={COLORS.orange} />
            <Text style={styles.cardHeaderText}> Equipment</Text>
          </View>
          <Text style={styles.equipmentSubtitle}>No equipment added yet.</Text>
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

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label="Home" onPress={onNavigateHome} />
        <TabItem
          icon="briefcase-outline"
          label="My Jobs"
          onPress={onNavigateApply}
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
    marginTop: 6,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 20 },
  verifiedBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 14,
  },
  premiumBadge: {
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginTop: 8,
  },
  premiumBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
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
    backgroundColor: COLORS.badgeBlueBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  skillPillText: {
    color: COLORS.badgeBlueText,
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: { flexDirection: "row", marginTop: 18, width: "100%" },
  bookBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
    marginRight: 10,
  },
  bookBtnText: { color: "#04202B", fontSize: 14, fontWeight: "700" },
  messageBtn: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  messageBtnText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  cardHeaderText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  equipmentRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  equipmentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  equipmentName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: "600" },
  equipmentSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  experienceRow: { paddingTop: 16, paddingBottom: 16 },
  experienceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  experienceYears: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  experienceRole: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  experienceDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  portfolioTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  viewAll: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  portfolioCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
  },
  portfolioImage: { width: "100%", height: 140 },
  portfolioBody: { padding: SPACING.md },
  portfolioItemTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  portfolioTagsRow: { flexDirection: "row", marginTop: 8, gap: 8 },
  portfolioTag: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  portfolioTagText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: 90,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 10,
    paddingBottom: 26,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
});
