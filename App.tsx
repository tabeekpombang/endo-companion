import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "@firebase/auth";
import { AuthScreen } from "./src/auth/AuthScreen";
import { auth } from "./src/firebase";
import { MainTabs } from "./src/navigation/MainTabs";
import { colors } from "./src/theme/colors";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticatedThisLaunch, setAuthenticatedThisLaunch] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        if (nextUser === null) {
          setAuthenticatedThisLaunch(false);
        }
        setAuthLoading(false);
      },
      () => {
        setUser(null);
        setAuthenticatedThisLaunch(false);
        setAuthLoading(false);
      },
    );
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthenticatedThisLaunch(false);
    } catch {
      Alert.alert("Could not sign out", "Please try again.");
    }
  };

  const handleAuthenticated = (signedInUser: User) => {
    setUser(signedInUser);
    setAuthenticatedThisLaunch(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {authLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.mauve} />
          <Text style={styles.loadingText}>Loading your account…</Text>
        </View>
      ) : user && authenticatedThisLaunch ? (
        <MainTabs onSignOut={handleSignOut} />
      ) : (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 13,
  },
});
