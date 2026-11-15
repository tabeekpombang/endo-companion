import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { HomeScreen } from "../screens/HomeScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { PrepareScreen } from "../screens/PrepareScreen";
import { TrackScreen } from "../screens/TrackScreen";

type Tab = "Home" | "Track" | "History" | "Prepare";

const tabs: { label: Tab; icon: string }[] = [
  { label: "Home", icon: "⌂" },
  { label: "Track", icon: "+" },
  { label: "History", icon: "◷" },
  { label: "Prepare", icon: "▤" },
];

type MainTabsProps = {
  onSignOut: () => void;
};

export function MainTabs({ onSignOut }: MainTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const openTrack = () => setActiveTab("Track");

  return (
    <View style={styles.app}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Home" ? (
          <HomeScreen onTrack={openTrack} onSignOut={onSignOut} />
        ) : activeTab === "Track" ? (
          <TrackScreen onSignOut={onSignOut} />
        ) : activeTab === "History" ? (
          <HistoryScreen onTrack={openTrack} onSignOut={onSignOut} />
        ) : (
          <PrepareScreen onTrack={openTrack} onSignOut={onSignOut} />
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
  );
}

const styles = StyleSheet.create({
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
