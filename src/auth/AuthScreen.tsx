import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type User,
} from "@firebase/auth";
import { auth } from "../firebase";
import { colors } from "../theme/colors";
import { AuthMode, authErrorMessage } from "./authErrors";

type AuthScreenProps = {
  onAuthenticated: (user: User) => void;
};

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setMessage("");
    setError("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }

    if (mode !== "reset-password" && password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "sign-up") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );
        onAuthenticated(credential.user);
      } else if (mode === "sign-in") {
        const credential = await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );
        onAuthenticated(credential.user);
      } else {
        await sendPasswordResetEmail(auth, normalizedEmail);
        setMessage(
          "If an account exists for that email, password reset instructions will be sent.",
        );
      }
    } catch (caught) {
      setError(authErrorMessage(caught, mode));
    } finally {
      setBusy(false);
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setError("");
    setMessage("");
    setPassword("");
    setMode(nextMode);
  };

  const title =
    mode === "sign-up"
      ? "Create your account"
      : mode === "reset-password"
        ? "Reset your password"
        : "Welcome back";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>♡</Text>
        </View>
        <Text style={styles.eyebrow}>ENDO COMPANION</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          A gentle space to support you through your health journey.
        </Text>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            returnKeyType={mode === "reset-password" ? "done" : "next"}
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          {mode !== "reset-password" ? (
            <>
              <Text style={[styles.inputLabel, styles.passwordLabel]}>
                Password
              </Text>
              <TextInput
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete={
                  mode === "sign-up" ? "new-password" : "current-password"
                }
                onChangeText={setPassword}
                onSubmitEditing={() => void submit()}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                secureTextEntry
                style={styles.input}
                textContentType={
                  mode === "sign-up" ? "newPassword" : "password"
                }
                value={password}
              />
            </>
          ) : null}

          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          {message ? (
            <Text accessibilityRole="alert" style={styles.success}>
              {message}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => void submit()}
            style={({ pressed }) => [
              styles.submit,
              busy && styles.disabled,
              pressed && !busy && styles.pressed,
            ]}
          >
            {busy ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.submitLabel}>
                {mode === "sign-up"
                  ? "Create account"
                  : mode === "reset-password"
                    ? "Send reset email"
                    : "Sign in"}
              </Text>
            )}
          </Pressable>

          {mode === "sign-in" ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => changeMode("reset-password")}
              style={styles.textButton}
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {mode === "sign-up"
                ? "Already have an account? "
                : mode === "reset-password"
                  ? "Remembered your password? "
                  : "New here? "}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                changeMode(mode === "sign-up" ? "sign-in" : "sign-up")
              }
            >
              <Text style={styles.link}>
                {mode === "sign-up" || mode === "reset-password"
                  ? "Sign in"
                  : "Create account"}
              </Text>
            </Pressable>
          </View>
          {mode === "reset-password" ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => changeMode("sign-in")}
              style={styles.textButton}
            >
              <Text style={styles.link}>Back to sign in</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.privacy}>
          Use a test account only. This prototype does not store health records.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  brandMark: {
    alignSelf: "center",
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfacePink,
    marginBottom: 18,
  },
  brandMarkText: {
    color: colors.mauve,
    fontSize: 30,
  },
  eyebrow: {
    color: colors.mauve,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.65,
    textAlign: "center",
  },
  title: {
    color: colors.plum,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
    textAlign: "center",
    marginTop: 8,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    marginTop: 30,
  },
  inputLabel: {
    color: colors.plum,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  passwordLabel: {
    marginTop: 18,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.plum,
    fontSize: 15,
    paddingHorizontal: 16,
  },
  error: {
    color: "#A1374B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  success: {
    color: colors.green,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  submit: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.mauve,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 22,
  },
  submitLabel: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.65,
  },
  textButton: {
    alignSelf: "center",
    padding: 12,
  },
  link: {
    color: colors.mauve,
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  footerText: {
    color: colors.muted,
    fontSize: 13,
  },
  privacy: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 28,
  },
  pressed: {
    opacity: 0.75,
  },
});
