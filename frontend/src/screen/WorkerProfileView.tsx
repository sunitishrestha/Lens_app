import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { getApplicantProfile, User } from "../api/auth";
import { API_BASE_URL } from "../api/client";

interface WorkerProfileViewProps {
  applicantId: number;
  onBack?: () => void;
}

export default function WorkerProfileView({
  applicantId,
  onBack,
}: WorkerProfileViewProps) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApplicantProfile(applicantId)
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load profile"),
      )
      .finally(() => setLoading(false));
  }, [applicantId]);

  const avatarUri = profile?.avatar_url
    ? `${API_BASE_URL}${profile.avatar_url}`
    : "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
      (profile?.email ?? "default");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicant Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.accent}
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.avatarBlock}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <Text style={styles.name}>{profile?.full_name}</Text>
            <Text style={styles.roleTag}>
              {profile?.role === "work" ? "Camera Professional" : "Hirer"}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="mail-outline" size={18} color={COLORS.accent} />
              <Text style={styles.cardHeaderText}> Contact</Text>
            </View>
            <Text style={styles.cardText}>{profile?.email}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="person-outline" size={18} color={COLORS.accent} />
              <Text style={styles.cardHeaderText}> About</Text>
            </View>
            <Text style={styles.cardText}>
              {profile?.bio || "This applicant hasn't added a bio yet."}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons
                name="aperture-outline"
                size={18}
                color={COLORS.accent}
              />
              <Text style={styles.cardHeaderText}> Skills</Text>
            </View>
            {profile?.skills && profile.skills.length > 0 ? (
              <View style={styles.skillsRow}>
                {profile.skills.map((skill) => (
                  <View key={skill} style={styles.skillPill}>
                    <Text style={styles.skillPillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.cardText}>No skills listed yet.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: 55,
    paddingBottom: SPACING.md,
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "700" },
  avatarBlock: { alignItems: "center", marginTop: SPACING.lg },
  avatar: { width: 96, height: 96, borderRadius: 20 },
  name: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 14,
  },
  roleTag: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
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
  },
  cardText: { color: COLORS.textSecondary, lineHeight: 20 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  skillPill: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  skillPillText: { color: COLORS.textPrimary, fontSize: 12 },
  errorText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
