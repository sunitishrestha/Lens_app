import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

const FILTERS = [
  "All Applicants",
  "Director of Photography",
  "Camera Operator",
  "2nd AC / Lighting",
];

const APPLICANTS = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Director of Photography",
    isPro: true,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    experienceLine: "5+ Years experience • 12 Wedding Credits",
    tags: ["RED Komodo", "DJI Ronin 4D", "Anamorphic Kit"],
  },
  {
    id: "2",
    name: "Marcus Thorne",
    role: "Camera Operator",
    isPro: false,
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    experienceLine: "8+ Years experience • Narrative Specialist",
    tags: ["ARRI Alexa Mini", "Steadicam Pro"],
  },
  {
    id: "3",
    name: "Liam Chen",
    role: "2nd AC / Lighting Tech",
    isPro: false,
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    experienceLine: "2 Years experience • Rising Talent",
    tags: ["Aputure Lighting", "Wireless Focus"],
  },
];

export default function HireJobapplicat({
  jobTitle = "Wedding Shoot: Estate Ceremony",
  jobDate = "JUNE 14, 2024",
  jobLocation = "Bel Air, CA",
  applicantCount = 12,
  budget = "R$ 45,000",
  onViewProfile,
  onSelectHire,
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Applicants");
  const [loadingMore] = useState(true);

  const filteredApplicants = APPLICANTS.filter((a) => {
    const matchesFilter =
      activeFilter === "All Applicants" || a.role === activeFilter;
    const matchesSearch =
      search.trim() === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
            <Text style={styles.logoText}>LensLease</Text>
          </View>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/12.jpg" }}
            style={styles.headerAvatar}
          />
        </View>

        {/* Posting info */}
        <View style={styles.postingBlock}>
          <View style={styles.postingTopRow}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE POSTING</Text>
            </View>
            <View style={styles.dateRow}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={COLORS.textSecondary}
              />
              <Text style={styles.dateText}> {jobDate}</Text>
            </View>
          </View>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color={COLORS.textSecondary}
            />
            <Text style={styles.locationText}> {jobLocation} • </Text>
            <Text style={styles.applicantCountText}>
              {applicantCount} Applicants
            </Text>
          </View>
        </View>

        {/* Budget card */}
        <View style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>PROJECT BUDGET CONTEXT</Text>
          <Text style={styles.budgetValue}>
            {budget} <Text style={styles.budgetValueUnit}>/ Total</Text>
          </Text>
          <View style={styles.budgetSubRow}>
            <Ionicons
              name="time-outline"
              size={12}
              color={COLORS.textSecondary}
            />
            <Text style={styles.budgetSubText}>
              {" "}
              Estimated professional day rate
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search applicants by name or gear..."
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
          />
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
        >
          {FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Applicant cards */}
        <View style={{ marginTop: SPACING.md }}>
          {filteredApplicants.map((applicant) => (
            <View key={applicant.id} style={styles.applicantCard}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: applicant.avatar }}
                  style={styles.applicantAvatar}
                />
                {applicant.isPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.applicantName}>{applicant.name}</Text>
              <Text style={styles.applicantRole}>{applicant.role}</Text>
              <Text style={styles.applicantExperience}>
                {applicant.experienceLine}
              </Text>

              <View style={styles.tagsRow}>
                {applicant.tags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  onPress={() => onViewProfile?.(applicant.id)}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectHireBtn}
                  onPress={() => onSelectHire?.(applicant.id)}
                >
                  <Text style={styles.selectHireText}>Select & Hire</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {loadingMore && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingText}>LOADING MORE APPLICANTS...</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="grid-outline" label="Feed" />
        <TabItem icon="briefcase" label="My Jobs" active />
        <TabItem icon="camera-outline" label="Equipment" />
        <TabItem icon="person-outline" label="Profile" />
      </View>
    </View>
  );
}

interface TabItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
}

function TabItem({ icon, label, active }: TabItemProps) {
  return (
    <TouchableOpacity style={styles.tabItem}>
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
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
  headerAvatar: { width: 30, height: 30, borderRadius: 15 },
  postingBlock: { paddingHorizontal: SPACING.lg, marginTop: 8 },
  postingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: COLORS.badgeBlueBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  activeBadgeText: {
    color: COLORS.badgeBlueText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { color: COLORS.textSecondary, fontSize: 11 },
  jobTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    lineHeight: 29,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  locationText: { color: COLORS.textSecondary, fontSize: 13 },
  applicantCountText: { color: COLORS.accent, fontSize: 13, fontWeight: "600" },
  budgetCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
  },
  budgetLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  budgetValue: {
    color: COLORS.accent,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },
  budgetValueUnit: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "400",
  },
  budgetSubRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  budgetSubText: { color: COLORS.textSecondary, fontSize: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    marginLeft: 8,
    fontSize: 13,
  },
  filterScroll: { marginTop: SPACING.md },
  filterChip: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterChipText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  filterChipTextActive: { color: "#04202B", fontWeight: "700" },
  applicantCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    alignItems: "center",
  },
  avatarWrap: { position: "relative" },
  applicantAvatar: { width: 72, height: 72, borderRadius: 36 },
  proBadge: {
    position: "absolute",
    bottom: -4,
    right: -6,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  proBadgeText: { color: "#2B1B04", fontSize: 9, fontWeight: "800" },
  applicantName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  applicantRole: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  applicantExperience: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 14,
    gap: 8,
  },
  tagPill: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  tagPillText: { color: COLORS.textSecondary, fontSize: 11 },
  actionRow: { flexDirection: "row", marginTop: 18, width: "100%" },
  viewProfileBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
    marginRight: 10,
  },
  viewProfileText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  selectHireBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  selectHireText: { color: "#04202B", fontSize: 13, fontWeight: "700" },
  loadingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 0.6,
    marginLeft: 10,
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
