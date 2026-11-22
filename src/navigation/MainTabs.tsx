import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { HomeScreen } from "../screens/HomeScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { PrepareScreen } from "../screens/PrepareScreen";
import { TrackScreen } from "../screens/TrackScreen";
import type { CheckIn } from "../api/checkIns";

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
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [checkInToEdit, setCheckInToEdit] = useState<CheckIn | undefined>();
  const openTrack = () => {
    setCheckInToEdit(undefined);
    setActiveTab("Track");
  };
  const openEdit = (checkIn: CheckIn) => {
    setCheckInToEdit(checkIn);
    setActiveTab("Track");
  };
  const onCheckInSaved = () => {
    setCheckInToEdit(undefined);
    setHistoryRefreshKey((current) => current + 1);
    setActiveTab("History");
  };

  return (
    <View style={styles.app}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Home" ? (
          <HomeScreen onTrack={openTrack} onSignOut={onSignOut} />
        ) : activeTab === "Track" ? (
          <TrackScreen
            onSaved={onCheckInSaved}
            onSignOut={onSignOut}
            checkInToEdit={checkInToEdit}
          />
        ) : activeTab === "History" ? (
          <HistoryScreen
            onTrack={openTrack}
            onEdit={openEdit}
            onSignOut={onSignOut}
            refreshKey={historyRefreshKey}
          />
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
