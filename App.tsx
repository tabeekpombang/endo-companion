import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from "react-native";

type Tab = "Home" | "Track" | "History" | "Prepare";

const tabs: { label: Tab; icon: string }[] = [
  { label: "Home", icon: "⌂" },
  { label: "Track", icon: "+" },
  { label: "History", icon: "◷" },
  { label: "Prepare", icon: "▤" },
];

const colors = {
  background: "#FFF9F6",
  surface: "#FFFFFF",
  surfacePink: "#F8E9EE",
  surfaceGreen: "#EDF3EB",
  plum: "#522D40",
  mauve: "#895069",
  muted: "#8C7D84",
  border: "#F0E4E8",
  green: "#59745D",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.app}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "Home" ? (
            <HomeScreen onTrack={() => setActiveTab("Track")} />
          ) : (
            <SectionScreen
              tab={activeTab}
              onTrack={() => setActiveTab("Track")}
            />
          )}
        </ScrollView>
        <View
          accessibilityRole="tablist"
          accessibilityLabel="Main navigation"
          style={styles.tabBar}
        >
          {tabs.map((tab) => {
            const selected = tab.label === activeTab;
            return (
              <Pressable
                key={tab.label}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={tab.label}
                onPress={() => setActiveTab(tab.label)}
                style={({ pressed }) => [
                  styles.tabButton,
                  selected && styles.activeTabButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  accessible={false}
                  style={[styles.tabIcon, selected && styles.activeTabText]}
                >
                  {tab.icon}
                </Text>
                <Text
                  accessible={false}
                  style={[styles.tabLabel, selected && styles.activeTabText]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ onTrack }: { onTrack: () => void }) {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR PRIVATE SPACE</Text>
          <Text style={styles.title}>A little space for you</Text>
          <Text style={styles.subtitle}>One day at a time.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>♡</Text>
        </View>
      </View>

      <View style={[styles.card, styles.checkInCard]}>
        <Text style={styles.cardEyebrow}>YOUR DAILY CHECK-IN</Text>
        <Text style={styles.cardTitle}>How are you feeling today?</Text>
        <Text style={styles.bodyText}>
          A quick check-in can help you keep track of what matters to you.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onTrack}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>＋  Log how you feel</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Your health journey</Text>
        <Text style={styles.eyebrow}>RECENT</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>♡</Text>
        </View>
        <Text style={styles.cardTitle}>Your check-ins will live here</Text>
        <Text style={styles.bodyText}>
          When you log an entry, you can come back here to review it.
        </Text>
      </View>

      <View style={[styles.card, styles.careCard]}>
        <Text style={styles.careIcon}>✳</Text>
        <View style={styles.careCopy}>
          <Text style={styles.careTitle}>Rest is part of caring for yourself.</Text>
          <Text style={styles.careText}>You don’t have to do it all today.</Text>
        </View>
      </View>
      <Text style={styles.privacyNote}>♙  Only you can see your health records.</Text>
    </>
  );
}

function SectionScreen({
  tab,
  onTrack,
}: {
  tab: Exclude<Tab, "Home">;
  onTrack: () => void;
}) {
  const content: Record<
    Exclude<Tab, "Home">,
    { eyebrow: string; title: string; description: string; action?: string }
  > = {
    Track: {
      eyebrow: "YOUR PRIVATE SPACE",
      title: "How are you feeling?",
      description:
        "The symptom check-in will be added in the next step. This is where you’ll record pain, symptoms, and how your day is going.",
    },
    History: {
      eyebrow: "YOUR EXPERIENCES, IN ONE PLACE",
      title: "Your health history",
      description:
        "Check-ins you choose to record will appear here, ready for you to review over time.",
      action: "Log your first check-in",
    },
    Prepare: {
      eyebrow: "YOUR VOICE BELONGS IN THE CONVERSATION",
      title: "Appointment prep",
      description:
        "Keep questions and concerns together so you can prepare for a conversation with your care team.",
      action: "Start with a check-in",
    },
  };
  const screen = content[tab];

  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>{screen.eyebrow}</Text>
          <Text style={styles.title}>{screen.title}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>♡</Text>
        </View>
      </View>
      <View style={[styles.card, styles.sectionCard]}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>
            {tab === "Track" ? "+" : tab === "History" ? "◷" : "♡"}
          </Text>
        </View>
        <Text style={styles.cardTitle}>{screen.title}</Text>
        <Text style={styles.bodyText}>{screen.description}</Text>
        {screen.action ? (
          <Pressable
            accessibilityRole="button"
            onPress={onTrack}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>{screen.action}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.privacyNote}>
        ♙  Your health information is private to you.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },
  header: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  eyebrow: {
    color: colors.mauve,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.65,
  },
  title: {
    color: colors.plum,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.45,
    marginTop: 5,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfacePink,
  },
  avatarText: {
    color: colors.mauve,
    fontSize: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  checkInCard: {
    backgroundColor: colors.surfacePink,
    borderColor: colors.surfacePink,
    padding: 20,
  },
  cardEyebrow: {
    color: colors.mauve,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.55,
  },
  cardTitle: {
    color: colors.plum,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600",
    marginTop: 7,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.mauve,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 18,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.plum,
    fontSize: 17,
    fontWeight: "600",
  },
  emptyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfacePink,
  },
  emptyIconText: {
    color: colors.mauve,
    fontSize: 21,
  },
  careCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceGreen,
    borderColor: colors.surfaceGreen,
    paddingVertical: 15,
    marginTop: 2,
  },
  careIcon: {
    color: colors.green,
    fontSize: 21,
    marginRight: 12,
  },
  careCopy: {
    flex: 1,
  },
  careTitle: {
    color: colors.plum,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  careText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  privacyNote: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 3,
    marginBottom: 8,
  },
  sectionCard: {
    marginTop: 18,
    padding: 20,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabButton: {
    minWidth: 64,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeTabButton: {
    backgroundColor: colors.surfacePink,
  },
  tabIcon: {
    color: colors.muted,
    fontSize: 19,
    lineHeight: 23,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 1,
  },
  activeTabText: {
    color: colors.mauve,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
});
