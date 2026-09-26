import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { getMyHiredJobs, HiredJob } from "../api/applications";

interface WorkNotificationsProps {
  onNavigateHome?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateProfile?: () => void;
}

export default function WorkNotifications({
  onNavigateHome,
  onNavigateNotifications,
  onNavigateProfile,
}: WorkNotificationsProps) {
  const [hiredJobs, setHiredJobs] = useState<HiredJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyHiredJobs()
      .then(setHiredJobs)
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.accent}
            style={{ marginTop: 40 }}
          />
        ) : hiredJobs.length === 0 ? (
          <Text style={styles.emptyText}>
            No hire notifications yet. Once a hirer selects you for a job, it'll
            show up here.
          </Text>
        ) : (
          hiredJobs.map((job) => (
            <View key={job.application_id} style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.accent}
                />
                <Text style={styles.cardHeaderText}> You've been hired!</Text>
              </View>
              <Text style={styles.jobTitle}>{job.vacancy_title}</Text>
              <View style={styles.metaRow}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}> {job.vacancy_location}</Text>
              </View>
              <Text style={styles.price}>{job.vacancy_price}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        <TabItem icon="grid" label="Feed" onPress={onNavigateHome} />
        <TabItem
          icon="notifications"
          label="Notifications"
          active
          onPress={onNavigateNotifications}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: 55,
    paddingBottom: SPACING.md,
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: "700" },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: SPACING.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardHeaderText: { color: COLORS.accent, fontSize: 13, fontWeight: "700" },
  jobTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: "700" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { color: COLORS.textSecondary, fontSize: 12 },
  price: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
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
