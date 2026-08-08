import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loginUser, registerUser } from "../api/auth";
import { useAuth } from "../store/authStore";

type Role = "hire" | "work";

type RegisterScreenProps = {
  onBackToLogin: () => void;
};

export default function RegisterScreen({ onBackToLogin }: RegisterScreenProps) {
  const [role, setRole] = useState<Role>("hire");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    if (!agreed) {
      Alert.alert(
        "Please agree",
        "You must accept the Terms of Service to continue.",
      );
      return;
    }
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      Alert.alert("Check your details", "Enter your name, a valid email, and a password of at least 8 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      await registerUser({ email: normalizedEmail, password, full_name: fullName.trim(), role });
      const session = await loginUser({ email: normalizedEmail, password });
      signIn(session);
    } catch (error) {
      Alert.alert("Registration failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Ionicons name="aperture-outline" size={16} color="#38bdf8" />
        </View>
        <Text style={styles.brand}>JOBLENS</Text>
        <Text style={styles.helpCenter}>HELP CENTER</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Elevate your production with premium cinematography gear and talent.
          </Text>

          <Text style={styles.sectionLabel}>CHOOSE YOUR PATH</Text>

          <TouchableOpacity
            style={[styles.roleCard, role === "hire" && styles.roleCardActive]}
            onPress={() => setRole("hire")}
          >
            <View style={styles.roleIconCircle}>
              <Ionicons name="people-outline" size={26} color="#38bdf8" />
            </View>
            <Text style={styles.roleTitle}>I want to Hire</Text>
            <Text style={styles.roleSubtitle}>
              Production Team, Director, or Studio looking for talent.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, role === "work" && styles.roleCardActive]}
            onPress={() => setRole("work")}
          >
            <View style={styles.roleIconCircle}>
              <Ionicons name="videocam-outline" size={26} color="#38bdf8" />
            </View>
            <Text style={styles.roleTitle}>I want to Work</Text>
            <Text style={styles.roleSubtitle}>
              Cinematographer, Camera Op, or Visual Artist.
            </Text>
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Alex Rivers"
            placeholderTextColor="#5b6a85"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.fieldLabel}>Professional Email</Text>
          <TextInput
            style={styles.input}
            placeholder="alex@studio.com"
            placeholderTextColor="#5b6a85"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#5b6a85"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && (
                <Ionicons name="checkmark" size={14} color="#0a0e1a" />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.linkText}>Terms of Service</Text> and{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>. I understand
              that JobLens verifies all professionals for security.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={onBackToLogin}>
            <Text style={styles.footerLink}>
              Already have an account?{" Login "}
              <Text style={styles.linkText}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#4b5a75"
            />
            <Text style={styles.trustText}>SECURE BOOKING</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="camera-outline" size={20} color="#4b5a75" />
            <Text style={styles.trustText}>GEAR PROTECTION</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="star-outline" size={20} color="#4b5a75" />
            <Text style={styles.trustText}>ELITE TALENT</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0e1a",
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#111a2e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  brand: {
    color: "#38bdf8",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
    flex: 1,
  },
  helpCenter: {
    color: "#8a97b3",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: "#0f1626",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1c2740",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#8a97b3",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  sectionLabel: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 12,
  },

  roleCard: {
    borderWidth: 1,
    borderColor: "#1c2740",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "#0d1420",
  },
  roleCardActive: {
    borderColor: "#38bdf8",
    backgroundColor: "#0e1b2e",
  },
  roleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#16223a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  roleTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  roleSubtitle: {
    color: "#8a97b3",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },

  fieldLabel: {
    color: "#c3cade",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1c2740",
    backgroundColor: "#0d1420",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    marginBottom: 4,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3a4a6b",
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#38bdf8", borderColor: "#38bdf8" },
  termsText: { color: "#8a97b3", fontSize: 12, flex: 1, lineHeight: 17 },
  linkText: { color: "#38bdf8", fontWeight: "600" },

  submitButton: {
    backgroundColor: "#38bdf8",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#38bdf8",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  submitButtonText: {
    color: "#062033",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  buttonDisabled: { opacity: 0.65 },

  divider: { height: 1, backgroundColor: "#1c2740", marginVertical: 20 },
  footerLink: { color: "#c3cade", textAlign: "center", fontSize: 13 },

  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
  },
  trustItem: { alignItems: "center", maxWidth: 90 },
  trustText: {
    color: "#4b5a75",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 6,
    textAlign: "center",
  },
});
