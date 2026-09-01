import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import { listVacancies, Vacancy } from "../api/vacancies";
import { applyToVacancy } from "../api/application";

interface EventItem {
  id: string;
  category: string;
  image: string;
  title: string;
  price: string;
  location: string;
}

const EVENTS: EventItem[] = [
  {
    id: "1",
    category: "WEDDING",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700",
    title: "Premium Black-Tie Wedding",
    price: "$1,200",
    location: "Chelsea, London — 5 miles away",
  },
  {
    id: "2",
    category: "COMMERCIAL",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700",
    title: "Luxury Tech Brand Campaign",
    price: "$1,850",
    location: "Shoreditch Studio — 8 miles away",
  },
  {
    id: "3",
    category: "MUSIC VIDEO",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700",
    title: "Indie Pop Visual EP",
    price: "$950",
    location: "Southbank, London — 3 miles away",
  },
];

interface WorkHomepageProps {
  onViewDetails?: (eventId: number) => void;
  onNavigateHome?: () => void;
  onNavigateApply?: () => void;
  onNavigateProfile?: () => void;
}

export default function WorkHomepage({
  onViewDetails,
  onNavigateHome,
  onNavigateApply,
  onNavigateProfile,
}: WorkHomepageProps) {
  const user = useAuthStore((s) => s.user);
  const [events, setEvents] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listVacancies()
      .then(setEvents)
      .catch((err) => console.log("Failed to load vacancies:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (vacancyId: number) => {
    try {
      await applyToVacancy({ vacancy_id: vacancyId });
      Alert.alert("Applied!", "Your application was submitted.");
    } catch (err) {
      Alert.alert(
        "Could not apply",
        err instanceof Error ? err.message : "Please try again.",
      );
    }
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
            <View style={styles.logoBox}>
              <Ionicons name="videocam" size={16} color={COLORS.accent} />
            </View>
            <Text style={styles.logoText}>LensLease</Text>
          </View>
          <TouchableOpacity>
            <Feather name="menu" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeLabel}>
            WELCOME BACK, {(user?.full_name ?? "THERE").toUpperCase()}
          </Text>
          <Text style={styles.welcomeTitle}>
            Ready for your{" "}
            <Text style={{ color: COLORS.accent }}>next shoot?</Text>
          </Text>
        </View>

        {/* Status card */}
        <View style={styles.statusCard}>
          <Ionicons
            name="star"
            size={18}
            color={COLORS.accent}
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>Elite DP</Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Search by gear or location..."
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
          />
        </View>

        {/* Jobs near you + filter */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.jobsNearBtn}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textPrimary}
            />
            <Text style={styles.jobsNearText}>Jobs near you</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#04202B" />
          </TouchableOpacity>
        </View>

        {/* Available Events header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Events</Text>
          <View style={styles.sectionHeaderRight}>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>{events.length} New</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all activity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event cards */}
        {loading ? (
          <Text style={{ color: COLORS.textSecondary, paddingHorizontal: 20 }}>
            Loading jobs...
          </Text>
        ) : events.length === 0 ? (
          <Text style={{ color: COLORS.textSecondary, paddingHorizontal: 20 }}>
            No open jobs right now. Check back soon.
          </Text>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventBody}>
                <View style={styles.eventTitleRow}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventPrice}>
                    {event.price}
                    <Text style={styles.eventPriceUnit}>/day</Text>
                  </Text>
                </View>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{event.category}</Text>
                </View>
                <View style={styles.eventLocationRow}>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.eventLocation}> {event.location}</Text>
                </View>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {event.applicant_count} applicant
                  {event.applicant_count === 1 ? "" : "s"} so far
                </Text>
                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() => {
                    onViewDetails?.(event.id);
                    handleApply(event.id);
                  }}
                >
                  <Text style={styles.viewDetailsText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="grid" label="Feed" active onPress={onNavigateHome} />
        <TabItem
          icon="briefcase-outline"
          label="My Job"
          onPress={onNavigateApply}
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
  logoBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoText: { color: COLORS.textPrimary, fontSize: 17, fontWeight: "700" },
  welcomeBlock: { paddingHorizontal: SPACING.lg, marginTop: 10 },
  welcomeLabel: { color: COLORS.textSecondary, fontSize: 12, letterSpacing: 1 },
  welcomeTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginTop: 6,
    lineHeight: 32,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
  },
  statusLabel: { color: COLORS.textSecondary, fontSize: 11 },
  statusValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    marginLeft: 8,
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  jobsNearBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    height: 48,
    marginRight: 10,
  },
  jobsNearText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 6,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: "700" },
  sectionHeaderRight: { flexDirection: "row", alignItems: "center" },
  newBadge: {
    backgroundColor: COLORS.badgeBlueBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginRight: 10,
  },
  newBadgeText: {
    color: COLORS.badgeBlueText,
    fontSize: 11,
    fontWeight: "600",
  },
  seeAll: { color: COLORS.accent, fontSize: 12, fontWeight: "500" },
  eventCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  eventImage: { width: "100%", height: 170, justifyContent: "flex-start" },
  categoryTag: {
    backgroundColor: "rgba(10,15,30,0.75)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 6,
  },
  categoryTagText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  eventBody: { padding: SPACING.md },
  eventTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
    lineHeight: 21,
  },
  eventPrice: { color: COLORS.accent, fontSize: 16, fontWeight: "700" },
  eventPriceUnit: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "400",
  },
  eventLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  eventLocation: { color: COLORS.textSecondary, fontSize: 12 },
  viewDetailsBtn: {
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  viewDetailsText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
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
