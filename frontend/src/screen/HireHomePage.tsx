import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";

// ---- Replace these with your real image URIs / require() assets later ----
const PROJECT_IMG_1 =
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600";
const PROJECT_IMG_2 =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600";
const AVATAR_1 = "https://randomuser.me/api/portraits/men/32.jpg";
const AVATAR_2 = "https://randomuser.me/api/portraits/women/44.jpg";
const AVATAR_3 = "https://randomuser.me/api/portraits/men/65.jpg";

const COLORS = {
  bg: "#0A0F1E",
  card: "#131A2C",
  cardBorder: "#1F293F",
  accent: "#7FD4F5",
  accentDark: "#5CC3EA",
  textPrimary: "#FFFFFF",
  textSecondary: "#8891A5",
  green: "#4ADE80",
  orange: "#F5A623",
  badgeBlue: "#1E3A5F",
  badgeBlueText: "#7FD4F5",
  badgeOrange: "#5C3D1E",
  badgeOrangeText: "#F5A623",
};

type StatCardProps = {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
  subColor?: string;
  icon: ReactNode;
};

function StatCard({
  label,
  value,
  valueColor,
  sub,
  subColor,
  icon,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardTop}>
        <Text style={styles.statLabel}>{label}</Text>
        {icon}
      </View>
      <Text style={[styles.statValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
      {sub ? (
        <Text style={[styles.statSub, subColor && { color: subColor }]}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

type StatusBadgeProps = { text: string; variant?: "blue" | "orange" };

function StatusBadge({ text, variant = "blue" }: StatusBadgeProps) {
  const bg = variant === "blue" ? COLORS.badgeBlue : COLORS.badgeOrange;
  const color =
    variant === "blue" ? COLORS.badgeBlueText : COLORS.badgeOrangeText;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

type ApplicantRowProps = {
  avatar: string;
  name: string;
  role: string;
  tag: string;
  time: string;
};

function ApplicantRow({ avatar, name, role, tag, time }: ApplicantRowProps) {
  return (
    <View style={styles.applicantRow}>
      <Image source={{ uri: avatar }} style={styles.applicantAvatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.applicantName}>{name}</Text>
        <Text style={styles.applicantRole}>{role}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.applicantTag}>{tag}</Text>
        <Text style={styles.applicantTime}>{time}</Text>
      </View>
    </View>
  );
}

interface HireHomepageProps {
  onPostJob?: () => void;
  onNavigateHome?: () => void;
  onNavigatePost?: () => void;
  onNavigateProfile?: () => void;
}

export default function HireHomepage({
  onPostJob,
  onNavigateHome,
  onNavigatePost,
  onNavigateProfile,
}: HireHomepageProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="videocam" size={22} color={COLORS.accent} />
            <Text style={styles.logoText}>LENSLEASE</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={{ marginRight: 14 }}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <View style={styles.avatarCircle} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Producer Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage your active sets and professional talent pool.
          </Text>
        </View>

        {/* Post a Job button */}
        <TouchableOpacity
          style={styles.postJobBtn}
          activeOpacity={0.85}
          onPress={onPostJob}
        >
          <Ionicons name="add-circle-outline" size={20} color="#04202B" />
          <Text style={styles.postJobText}>Post a Job</Text>
        </TouchableOpacity>

        {/* Stat cards */}
        <StatCard
          label="ACTIVE JOBS"
          value="12"
          sub="↗ +2 this week"
          subColor={COLORS.green}
          icon={
            <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
          }
        />
        <StatCard
          label="TOTAL APPLICANTS"
          value="148"
          sub="Awaiting review"
          subColor={COLORS.textSecondary}
          icon={
            <Ionicons name="people-outline" size={18} color={COLORS.accent} />
          }
        />
        <StatCard
          label="HIRED PROS"
          value="34"
          valueColor={COLORS.orange}
          sub="On current projects"
          subColor={COLORS.textSecondary}
          icon={
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={COLORS.accent}
            />
          }
        />

        {/* My Active Projects */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Active Projects</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Project Card 1 */}
        <View style={styles.projectCard}>
          <Image source={{ uri: PROJECT_IMG_1 }} style={styles.projectImage} />
          <View style={styles.projectBody}>
            <View style={styles.projectTitleRow}>
              <Text style={styles.projectTitle}>Cyberpunk Short Film</Text>
              <StatusBadge text="RECRUITING" variant="blue" />
            </View>
            <View style={styles.projectMetaRow}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={COLORS.textSecondary}
              />
              <Text style={styles.projectMeta}> Oct 12 - Oct 25</Text>
            </View>
            <View style={styles.projectFooterRow}>
              <View style={styles.avatarStack}>
                <Image
                  source={{ uri: AVATAR_1 }}
                  style={[styles.stackAvatar, { marginLeft: 0 }]}
                />
                <Image source={{ uri: AVATAR_2 }} style={styles.stackAvatar} />
                <View style={styles.stackMore}>
                  <Text style={styles.stackMoreText}>+1</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Project Card 2 */}
        <View style={styles.projectCard}>
          <Image source={{ uri: PROJECT_IMG_2 }} style={styles.projectImage} />
          <View style={styles.projectBody}>
            <View style={styles.projectTitleRow}>
              <Text style={styles.projectTitle}>Mountain Peak Documentary</Text>
              <StatusBadge text="IN PROGRESS" variant="orange" />
            </View>
            <View style={styles.projectMetaRow}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={COLORS.textSecondary}
              />
              <Text style={styles.projectMeta}> Ongoing</Text>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>
              <Text style={styles.progressLabel}>65%</Text>
            </View>
          </View>
        </View>

        {/* New Applicants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Applicants</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.applicantsCard}>
          <ApplicantRow
            avatar={AVATAR_1}
            name="Marcus Chen"
            role="Master Cinematographer"
            tag="4K Expert"
            time="2m ago"
          />
          <View style={styles.divider} />
          <ApplicantRow
            avatar={AVATAR_2}
            name="Elena Vance"
            role="Arri Alexa Specialist"
            tag="Full Frame"
            time="45m ago"
          />
          <View style={styles.divider} />
          <ApplicantRow
            avatar={AVATAR_3}
            name="Jordan Smith"
            role="Drone Operator / Pilot"
            tag="Licensed"
            time="2h ago"
          />
        </View>

        <TouchableOpacity style={styles.inviteBtn}>
          <Text style={styles.inviteBtnText}>Invite more talent</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home" label="Home" active onPress={onNavigateHome} />
        <TabItem
          icon="add-circle-outline"
          label="Post"
          onPress={onNavigatePost}
        />
        <TabItem
          icon="person-outline"
          label="Profile"
          onPress={onNavigateProfile}
        />
      </View>
    </View>
  );
}

type TabItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

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
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2A3244",
  },
  titleBlock: { paddingHorizontal: 20, marginTop: 14 },
  title: { color: COLORS.textPrimary, fontSize: 26, fontWeight: "700" },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  postJobBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  postJobText: {
    color: "#04202B",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
  },
  statCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { color: COLORS.textSecondary, fontSize: 12, letterSpacing: 0.8 },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 6,
  },
  statSub: { fontSize: 12, marginTop: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "600" },
  viewAll: { color: COLORS.accent, fontSize: 13, fontWeight: "500" },
  projectCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    overflow: "hidden",
  },
  projectImage: { width: "100%", height: 130 },
  projectBody: { padding: 14 },
  projectTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  projectMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  projectMeta: { color: COLORS.textSecondary, fontSize: 12 },
  projectFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  stackAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  stackMore: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2A3244",
    marginLeft: -8,
    borderWidth: 2,
    borderColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  stackMoreText: { color: COLORS.textPrimary, fontSize: 10, fontWeight: "600" },
  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#2A3244",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: COLORS.orange, borderRadius: 3 },
  progressLabel: { color: COLORS.textSecondary, fontSize: 12, marginLeft: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4 },
  applicantsCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 6,
  },
  applicantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  applicantAvatar: { width: 42, height: 42, borderRadius: 21 },
  applicantName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: "600" },
  applicantRole: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  applicantTag: { color: COLORS.accent, fontSize: 12, fontWeight: "600" },
  applicantTime: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 14,
  },
  inviteBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderStyle: "dashed",
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  inviteBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
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
