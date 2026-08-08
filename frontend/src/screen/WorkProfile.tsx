import React from "react";
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
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

interface EquipmentItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  subtitle: string;
}

interface ExperienceItem {
  id: string;
  years: string;
  role: string;
  description: string;
}

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  tags: string[];
}

const EQUIPMENT: EquipmentItem[] = [
  {
    id: "1",
    icon: "videocam-outline",
    name: "Sony FX6",
    subtitle: "FULL FRAME CINEMA",
  },
  {
    id: "2",
    icon: "airplane-outline",
    name: "DJI Mavic 3 Pro",
    subtitle: "4/3 CMOS HASSELBLAD",
  },
];

const EXPERIENCE: ExperienceItem[] = [
  {
    id: "1",
    years: "2023 - PRESENT",
    role: "Lead DP @ Aurora Films",
    description:
      "Spearheaded cinematography for national commercial campaigns.",
  },
  {
    id: "2",
    years: "2021 - 2023",
    role: "Freelance Camera Op",
    description: "Music videos and documentary shorts across Europe.",
  },
];

const PORTFOLIO: PortfolioItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700",
    title: "Neon Pulse - Commercial",
    tags: ["ARRI ALEXA", "4K RAW"],
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700",
    title: "Mountain Peaks - Documentary",
    tags: ["MAVIC 3 PRO", "10-BIT LOG"],
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700",
    title: "Midnight Soul - Music Video",
    tags: ["SONY FX6", "ANAMORPHIC"],
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700",
    title: "Precision - Product Spot",
    tags: ["RED KOMODO", "MACRO 100MM"],
  },
];

interface CameramanProfileScreenProps {
  name?: string;
  role?: string;
  avatarUri?: string;
  skills?: string[];
  onBookNow?: () => void;
  onMessage?: () => void;
  onNavigateHome?: () => void;
  onNavigateApply?: () => void;
  onNavigateProfile?: () => void;
  onLogout?: () => void;
}

export default function CameramanProfileScreen({
  name = "Alex Rivers",
  role = "Cinematographer",
  avatarUri = "https://randomuser.me/api/portraits/men/32.jpg",
  skills = ["4K RAW", "Drone Pilot", "DaVinci Resolve"],
  onBookNow,
  onMessage,
  onNavigateHome,
  onNavigateApply,
  onNavigateProfile,
  onLogout,
}: CameramanProfileScreenProps) {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: onLogout },
    ]);
  };

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
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.accent}
              />
            </View>
          </View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM MEMBER</Text>
          </View>
          <Text style={styles.roleText}>{role}</Text>

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
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="aperture-outline" size={18} color={COLORS.orange} />
            <Text style={styles.cardHeaderText}> Equipment</Text>
          </View>
          {EQUIPMENT.map((item) => (
            <View key={item.id} style={styles.equipmentRow}>
              <View style={styles.equipmentIconBox}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={COLORS.textPrimary}
                />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.equipmentName}>{item.name}</Text>
                <Text style={styles.equipmentSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Experience card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.orange} />
            <Text style={styles.cardHeaderText}> Experience</Text>
          </View>
          {EXPERIENCE.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.experienceRow,
                index < EXPERIENCE.length - 1 && styles.experienceRowBorder,
              ]}
            >
              <Text style={styles.experienceYears}>{item.years}</Text>
              <Text style={styles.experienceRole}>{item.role}</Text>
              <Text style={styles.experienceDescription}>
                {item.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Portfolio */}
        <View style={styles.sectionHeader}>
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="grid-outline"
              size={18}
              color={COLORS.textPrimary}
            />
            <Text style={styles.portfolioTitle}> Portfolio</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {PORTFOLIO.map((item) => (
          <View key={item.id} style={styles.portfolioCard}>
            <Image source={{ uri: item.image }} style={styles.portfolioImage} />
            <View style={styles.portfolioBody}>
              <Text style={styles.portfolioItemTitle}>{item.title}</Text>
              <View style={styles.portfolioTagsRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.portfolioTag}>
                    <Text style={styles.portfolioTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

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
