import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { useEffect, useState } from "react";
import { getVacancy, Vacancy } from "../api/vacancies";
import { applyToVacancy } from "../api/application";
import { Alert } from "react-native";

const EQUIPMENT_OPTIONS = [
  "ARRI Alexa Mini LF",
  "RED V-Raptor",
  "Sony A7S III",
  "DJI Ronin RS3",
  "Teradek Bolt 600",
];

interface ApplyJobScreenProps {
  vacancyId: number;
  onCancel?: () => void;
  onSubmitted?: () => void;
  onNavigateHome?: () => void;
  onNavigateApply?: () => void;
  onNavigateProfile?: () => void;
}

export default function ApplyJobScreen({
  vacancyId,
  onCancel,
  onSubmitted,
  onNavigateHome,
  onNavigateApply,
  onNavigateProfile,
}: ApplyJobScreenProps) {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [message, setMessage] = useState("");
  const [confirmedAvailability, setConfirmedAvailability] = useState(false);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getVacancy(vacancyId)
      .then(setVacancy)
      .catch((err) => console.log(err));
  }, [vacancyId]);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
  };

  const handleSubmit = async () => {
    if (!confirmedAvailability) {
      Alert.alert(
        "Confirm availability",
        "Please confirm you're available before submitting.",
      );
      return;
    }
    setSubmitting(true);
    try {
      await applyToVacancy({
        vacancy_id: vacancyId,
        portfolio_link: portfolioLink || undefined,
        message: message || undefined,
        confirmed_availability: confirmedAvailability,
        equipment: equipment.length > 0 ? equipment : undefined,
      });
      Alert.alert(
        "Application submitted!",
        "The hirer will review your application.",
      );
      onSubmitted?.();
    } catch (err) {
      Alert.alert(
        "Could not apply",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="videocam" size={20} color={COLORS.accent} />
            <Text style={styles.logoText}>LensLease</Text>
          </View>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>

        {/* Event banner */}
        {/* Job info header */}
        <View style={styles.plainBanner}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>
              {vacancy?.category ?? "JOB"}
            </Text>
          </View>
          <Text style={styles.bannerTitle}>
            {vacancy?.title ?? "Loading..."}
          </Text>
          <View style={styles.bannerLocationRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color={COLORS.textSecondary}
            />
            <Text style={styles.bannerLocation}>
              {" "}
              {vacancy?.location ?? ""}
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.accent,
              fontSize: 16,
              fontWeight: "700",
              marginTop: 8,
            }}
          >
            {vacancy?.price ?? ""}
          </Text>
        </View>

        {/* Portfolio link */}
        <Text style={styles.fieldLabel}>PORTFOLIO LINK</Text>
        <View style={styles.inputRow}>
          <Feather name="link" size={16} color={COLORS.textSecondary} />
          <TextInput
            value={portfolioLink}
            onChangeText={setPortfolioLink}
            placeholder="https://vimeo.com/your-showreel"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        {/* CV upload */}
        <Text style={styles.fieldLabel}>CV / RESUME (PDF)</Text>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? "Submitting..." : "Submit Application"}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#04202B"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        {/* Message */}
        <Text style={styles.fieldLabel}>MESSAGE TO HIRER</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Briefly describe your experience with high-end wedding cinematography and your available kit..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.textArea}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Confirmation & Specs card */}
        <View style={styles.confirmCard}>
          <View style={styles.confirmHeaderRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
            <Text style={styles.confirmTitle}> Confirmation & Specs</Text>
          </View>
          <Text style={styles.confirmSubtext}>
            Confirm you are available for the entire duration of the shoot
            (08:00 - 22:00).
          </Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setConfirmedAvailability((v) => !v)}
          >
            <View
              style={[
                styles.checkbox,
                confirmedAvailability && styles.checkboxChecked,
              ]}
            >
              {confirmedAvailability && (
                <Ionicons name="checkmark" size={13} color={COLORS.bg} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              I confirm full availability
            </Text>
          </TouchableOpacity>

          <Text style={styles.equipmentLabel}>
            Select Equipment Used for this gig:
          </Text>
          {EQUIPMENT_OPTIONS.map((item) => {
            const checked = equipment.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={styles.checkboxRow}
                onPress={() => toggleEquipment(item)}
              >
                <View
                  style={[styles.checkbox, checked && styles.checkboxChecked]}
                >
                  {checked && (
                    <Ionicons name="checkmark" size={13} color={COLORS.bg} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitText}>Submit Application</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#04202B"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By submitting, you agree to our Terms of Service for Professional
          Operators.
        </Text>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label="Home" onPress={onNavigateHome} />
        <TabItem
          icon="briefcase"
          label="My Jobs"
          active
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
  logoText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  plainBanner: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
  },

  banner: {
    height: 220,
    marginHorizontal: SPACING.lg,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bannerOverlay: {
    backgroundColor: "rgba(6,10,22,0.55)",
    padding: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  bannerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  premiumBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bannerDate: { color: "#E5E9F0", fontSize: 12 },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    lineHeight: 29,
  },
  bannerLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  bannerLocation: { color: "#E5E9F0", fontSize: 12 },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "600",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  input: { flex: 1, color: COLORS.textPrimary, marginLeft: 8, fontSize: 13 },
  uploadBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  uploadText: { color: COLORS.textPrimary, fontSize: 13 },
  uploadMax: { color: COLORS.textMuted, fontSize: 11 },
  textArea: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 13,
    minHeight: 110,
  },
  confirmCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  confirmHeaderRow: { flexDirection: "row", alignItems: "center" },
  confirmTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "700" },
  confirmSubtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkboxLabel: { color: COLORS.textPrimary, fontSize: 13 },
  equipmentLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 18 },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingVertical: 15,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#04202B", fontSize: 16, fontWeight: "700" },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    lineHeight: 16,
  },
  tabBar: {
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
