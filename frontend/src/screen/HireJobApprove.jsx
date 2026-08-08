import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

export default function HireJobApprove({
  operatorName = "Alex Rivers",
  operatorRole = "DIRECTOR OF PHOTOGRAPHY",
  operatorRating = "4.9",
  operatorAvatar = "https://randomuser.me/api/portraits/men/32.jpg",
  hirerAvatar = "https://randomuser.me/api/portraits/men/12.jpg",
  onGoToDashboard,
  onMessageOperator,
}) {
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
          <Image source={{ uri: hirerAvatar }} style={styles.headerAvatar} />
        </View>

        {/* Success icon */}
        <View style={styles.successIconOuter}>
          <View style={styles.successIconInner}>
            <Ionicons name="checkmark" size={30} color={COLORS.accent} />
          </View>
        </View>

        {/* Title + description */}
        <Text style={styles.title}>Operator Selected</Text>
        <Text style={styles.description}>
          Your production team just got a massive upgrade. We&apos;ve notified{" "}
          <Text style={styles.descriptionBold}>{operatorName}</Text> of your
          selection.
        </Text>

        {/* Notification sent card */}
        <View style={styles.notifyCard}>
          <View style={styles.notifyIconBox}>
            <Ionicons name="mail-outline" size={20} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.notifyLabel}>NOTIFICATION SENT</Text>
            <Text style={styles.notifyText}>
              Confirmation email sent to {operatorName}. You&apos;ll receive an
              alert once they accept the project brief.
            </Text>
          </View>
        </View>

        {/* Operator card */}
        <View style={styles.operatorCard}>
          <Image
            source={{ uri: operatorAvatar }}
            style={styles.operatorAvatar}
          />
          <View style={{ marginLeft: SPACING.md, flex: 1 }}>
            <Text style={styles.operatorName}>{operatorName}</Text>
            <View style={styles.operatorMetaRow}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{operatorRole}</Text>
              </View>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color={COLORS.textPrimary} />
                <Text style={styles.ratingText}> {operatorRating}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.dashboardBtn}
          onPress={onGoToDashboard}
          activeOpacity={0.85}
        >
          <Ionicons name="grid" size={18} color="#04202B" />
          <Text style={styles.dashboardBtnText}> Go to Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageBtn}
          onPress={onMessageOperator}
          activeOpacity={0.85}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={COLORS.textPrimary}
          />
          <Text style={styles.messageBtnText}> Message Operator</Text>
        </TouchableOpacity>
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

function TabItem({ icon, label, active }) {
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  successIconOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(127,212,245,0.08)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 44,
  },
  successIconInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(127,212,245,0.15)",
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: SPACING.xl,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.xl,
  },
  descriptionBold: { color: COLORS.textPrimary, fontWeight: "700" },
  notifyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  notifyIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.badgeBlueBg,
    alignItems: "center",
    justifyContent: "center",
  },
  notifyLabel: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  notifyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  operatorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
  },
  operatorAvatar: { width: 56, height: 56, borderRadius: 12 },
  operatorName: { color: COLORS.textPrimary, fontSize: 17, fontWeight: "700" },
  operatorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  roleBadge: {
    backgroundColor: COLORS.badgeOrangeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: COLORS.badgeOrangeText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  ratingText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: "600" },
  dashboardBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dashboardBtnText: { color: "#04202B", fontSize: 16, fontWeight: "700" },
  messageBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBtnText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
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
