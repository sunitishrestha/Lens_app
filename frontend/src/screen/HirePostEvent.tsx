import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { Alert } from "react-native";
import { createVacancy } from "../api/vacancies";

interface GearGroup {
  id: string;
  label: string;
  items: string[];
}

const GEAR_GROUPS: GearGroup[] = [
  {
    id: "camera",
    label: "CAMERA BODY",
    items: ["4K Cinema Body (FX3/C70)", "Mirrorless Hybrid (A7SIII/R5)"],
  },
  {
    id: "lens",
    label: "LENS KIT",
    items: ["Prime Lens Set (35/50/85)", "Zoom Trinity (16-35/24-70/70-200)"],
  },
  {
    id: "lighting",
    label: "LIGHTING & GRIP",
    items: ["3-Point LED Lighting Kit", "3-Axis Gimbal (RS3 Pro)"],
  },
  {
    id: "audio",
    label: "AUDIO GEAR",
    items: ["Wireless Lavalier Set", "Shotgun Mic & Boom Pole"],
  },
];

const EVENT_TYPES = [
  "Wedding",
  "Commercial",
  "Music Video",
  "Documentary",
  "Corporate",
  "Portrait",
];

export interface CreateEventPayload {
  eventType: string;
  location: string;
  date: string;
  time: string;
  peopleRequired: string;
  budget: string;
  gearRequirements: string[];
}

interface HirePostEventProps {
  onPosted?: () => void;
  onCancel?: () => void;
  onNavigateHome?: () => void;
  onNavigatePost?: () => void;
  onNavigateProfile?: () => void;
}

export default function HirePostEvent({
  onPosted,
  onCancel,
  onNavigateHome,
  onNavigatePost,
  onNavigateProfile,
}: HirePostEventProps) {
  const [eventType, setEventType] = useState("Wedding");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());
  const [timeObj, setTimeObj] = useState(new Date());
  const [peopleRequired, setPeopleRequired] = useState("1");
  const [budget, setBudget] = useState("");
  const [gearRequirements, setGearRequirements] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleGear = (item: string) => {
    setGearRequirements((prev) =>
      prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item],
    );
  };

  const handlePostEvent = async () => {
    if (!location.trim()) {
      Alert.alert("Missing location", "Please enter a location for this job.");
      return;
    }
    if (!budget.trim()) {
      Alert.alert("Missing budget", "Please enter a budget for this job.");
      return;
    }

    setSubmitting(true);
    try {
      await createVacancy({
        title: `${eventType} Shoot in ${location}`,
        category: eventType.toUpperCase(),
        description:
          `Looking for ${peopleRequired} professional(s) for a ${eventType.toLowerCase()} shoot on ${date || "TBD"} at ${time || "TBD"}. ` +
          (gearRequirements.length > 0
            ? `Gear needed: ${gearRequirements.join(", ")}.`
            : ""),
        location,
        price: `Rs ${budget}`,
      });
      Alert.alert("Job posted!", "Workers can now see and apply to this job.");
      onPosted?.();
      onCancel?.();
    } catch (err) {
      Alert.alert(
        "Could not post job",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      const formatted = `${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${selectedDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${selectedDate.getFullYear()}`;
      setDate(formatted);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTimeObj(selectedTime);
      let hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
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
        <View>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={handlePostEvent}
            activeOpacity={0.85}
            disabled={submitting}
          >
            <Ionicons name="send-outline" size={16} color="#04202B" />
            <Text style={styles.postBtnText}>
              {submitting ? " Posting..." : " Post Event"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Create New Event</Text>
          <Text style={styles.subtitle}>
            Streamlined event creation. Define your vision and get matched with
            elite professionals.
          </Text>
        </View>

        {/* Event Details */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
          <Text style={styles.sectionHeaderText}> Event Details</Text>
        </View>

        <Text style={styles.fieldLabel}>EVENT TYPE</Text>
        <TouchableOpacity
          style={styles.lightInputRow}
          onPress={() => setTypeDropdownOpen((v) => !v)}
          activeOpacity={0.8}
        >
          <Text style={styles.lightInputText}>{eventType}</Text>
          <Ionicons
            name={typeDropdownOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={COLORS.bg}
          />
        </TouchableOpacity>
        {typeDropdownOpen && (
          <View style={styles.dropdown}>
            {EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setEventType(type);
                  setTypeDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
                {type === eventType && (
                  <Ionicons name="checkmark" size={16} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.fieldLabel}>LOCATION</Text>
        <View style={styles.lightInputRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={COLORS.accentDark}
          />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Enter venue or city..."
            placeholderTextColor="#8A93A6"
            style={styles.lightInput}
          />
        </View>

        <View style={styles.rowSplit}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>DATE</Text>
            <TouchableOpacity
              style={styles.lightInputRow}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.lightInput, !date && { color: "#8A93A6" }]}>
                {date || "mm/dd/yyyy"}
              </Text>
              <Ionicons name="calendar-outline" size={16} color={COLORS.bg} />
            </TouchableOpacity>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>TIME</Text>
            <TouchableOpacity
              style={styles.lightInputRow}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.lightInput, !time && { color: "#8A93A6" }]}>
                {time || "--:-- --"}
              </Text>
              <Ionicons name="time-outline" size={16} color={COLORS.bg} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={timeObj}
              mode="time"
              display="default"
              onChange={onTimeChange}
              is24Hour={false}
            />
          )}
        </View>

        {/* Capacity & Compensation */}
        <View style={[styles.sectionHeaderRow, { marginTop: SPACING.xl }]}>
          <Ionicons name="people-outline" size={18} color={COLORS.accent} />
          <Text style={styles.sectionHeaderText}> Capacity & Compensation</Text>
        </View>

        <Text style={styles.fieldLabel}>PEOPLE REQUIRED</Text>
        <View style={styles.lightInputRow}>
          <TextInput
            value={peopleRequired}
            onChangeText={setPeopleRequired}
            keyboardType="number-pad"
            style={styles.lightInput}
          />
        </View>

        <Text style={styles.fieldLabel}>SALARY / BUDGET (RS)</Text>
        <View style={styles.lightInputRow}>
          <Ionicons
            name="pricetag-outline"
            size={16}
            color={COLORS.accentDark}
          />
          <TextInput
            value={budget}
            onChangeText={setBudget}
            placeholder="0.00"
            placeholderTextColor="#8A93A6"
            keyboardType="decimal-pad"
            style={styles.lightInput}
          />
          <Text style={styles.currencySuffix}>RS</Text>
        </View>

        {/* Post Event button */}
        <TouchableOpacity
          style={styles.postBtn}
          onPress={handlePostEvent}
          activeOpacity={0.85}
        >
          <Ionicons name="send-outline" size={16} color="#04202B" />
          <Text style={styles.postBtnText}> Post Event</Text>
        </TouchableOpacity>

        {/* Gear Requirements */}
        <View style={[styles.sectionHeaderRow, { marginTop: SPACING.xl }]}>
          <Ionicons name="aperture-outline" size={18} color={COLORS.accent} />
          <Text style={styles.sectionHeaderText}> Gear Requirements</Text>
        </View>

        {GEAR_GROUPS.map((group) => (
          <View key={group.id} style={{ marginTop: SPACING.md }}>
            <Text style={styles.groupLabel}>{group.label}</Text>
            {group.items.map((item) => {
              const checked = gearRequirements.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleGear(item)}
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
        ))}

        {/* Pro Tip */}
        <View style={styles.proTipCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.accent} />
            <Text style={styles.proTipTitle}> Pro Tip</Text>
          </View>
          <Text style={styles.proTipText}>
            Listing specific Gear Requirements increases your application
            quality by up to 45%. Professionals appreciate knowing the technical
            scope upfront.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label="Home" onPress={onNavigateHome} />
        <TabItem
          icon="add-circle"
          label="Post"
          onPress={onNavigatePost}
          active
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
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
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
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  titleBlock: { paddingHorizontal: SPACING.lg, marginTop: 6 },
  title: { color: COLORS.textPrimary, fontSize: 26, fontWeight: "700" },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 19,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionHeaderText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: "600",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  lightInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  lightInputText: { color: COLORS.bg, fontSize: 14, fontWeight: "600" },
  lightInput: { flex: 1, color: COLORS.bg, marginLeft: 8, fontSize: 14 },
  currencySuffix: { color: COLORS.textMuted, fontSize: 13, fontWeight: "600" },
  dropdown: {
    backgroundColor: "#F5F7FA",
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginTop: 6,
    paddingVertical: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E8EF",
  },
  dropdownItemText: { color: COLORS.bg, fontSize: 14 },
  rowSplit: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    marginTop: 0,
  },
  halfField: {
    flex: 1,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  postBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingVertical: 15,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  postBtnText: { color: "#04202B", fontSize: 16, fontWeight: "700" },
  groupLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: "700",
    marginHorizontal: SPACING.lg,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.lg,
    marginBottom: 12,
  },
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
  checkboxLabel: { color: COLORS.textPrimary, fontSize: 13.5 },
  proTipCard: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingLeft: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  proTipTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: "700" },
  proTipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
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
