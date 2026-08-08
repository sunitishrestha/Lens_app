import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../api/auth";
import { useAuth } from "../store/authStore";

type LoginScreenProps = {
  onRegister: () => void;
};

export default function LoginScreen({ onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await loginUser({ email: email.trim(), password });
      signIn(response);
    } catch (error) {
      Alert.alert("Login failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Ionicons name="aperture-outline" size={22} color="#38bdf8" />
          <Text style={styles.logoText}>JobLens</Text>
        </View>

        <Text style={styles.title}>Ready for your next shoot?</Text>
        <Text style={styles.subtitle}>
          Log in to access your professional gear kit.
        </Text>

        <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
        <View style={styles.inputRow}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#5b6a85"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="alex@director.com"
            placeholderTextColor="#5b6a85"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.passwordLabelRow}>
          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#5b6a85"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="••••••••"
            placeholderTextColor="#5b6a85"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text style={styles.loginButtonText}>
            {isSubmitting ? "LOGGING IN..." : "LOG IN"}
          </Text>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR CONTINUE WITH</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={18} color="#fff" />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.footerLink}>
            Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerIcons}>
        <Ionicons name="videocam-outline" size={22} color="#3a4a6b" />
        <Ionicons name="camera-outline" size={22} color="#3a4a6b" />
        <Ionicons name="film-outline" size={22} color="#3a4a6b" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0e1a",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#0f1626",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1c2740",
    padding: 24,
  },
  logoBox: { alignItems: "center", marginBottom: 20 },
  logoText: { color: "#fff", fontWeight: "700", fontSize: 14, marginTop: 6 },
  title: {
    color: "#38bdf8",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8a97b3",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  fieldLabel: {
    color: "#c3cade",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1c2740",
    backgroundColor: "#0d1420",
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 8 },
  inputWithIcon: { flex: 1, color: "#fff", paddingVertical: 14 },
  linkText: { color: "#38bdf8", fontWeight: "600", fontSize: 12 },

  loginButton: {
    backgroundColor: "#38bdf8",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#38bdf8",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  loginButtonText: {
    color: "#062033",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  },
  buttonDisabled: { opacity: 0.65 },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 22 },
  orLine: { flex: 1, height: 1, backgroundColor: "#1c2740" },
  orText: {
    color: "#5b6a85",
    fontSize: 10,
    fontWeight: "700",
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },

  socialRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1c2740",
    backgroundColor: "#0d1420",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  socialText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  footerLink: { color: "#c3cade", textAlign: "center", fontSize: 13 },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginTop: 24,
  },
});
