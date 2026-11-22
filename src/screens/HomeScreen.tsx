import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";

type HomeScreenProps = {
  onTrack: () => void;
  onSignOut: () => void;
};

export function HomeScreen({ onTrack, onSignOut }: HomeScreenProps) {
  return (
    <>
      <ScreenHeader
        eyebrow="YOUR PRIVATE SPACE"
        title="A little space for you"
        subtitle="One day at a time."
        onSignOut={onSignOut}
      />

      <View style={styles.checkInCard}>
        <Text style={styles.cardEyebrow}>YOUR DAILY CHECK-IN</Text>
        <Text style={styles.cardTitle}>How are you feeling today?</Text>
        <Text style={styles.bodyText}>
          A quick check-in can help you keep track of what matters to you.
        </Text>
        <PrimaryButton label="＋  Log how you feel" onPress={onTrack} />
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Your health journey</Text>
        <Text style={styles.cardEyebrow}>RECENT</Text>
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

      <View style={styles.careCard}>
        <Text style={styles.careIcon}>✳</Text>
        <View style={styles.careCopy}>
          <Text style={styles.careTitle}>
            Rest is part of caring for yourself.
          </Text>
          <Text style={styles.careText}>You don’t have to do it all today.</Text>
        </View>
      </View>
      <Text style={styles.privacyNote}>
        Use fictional health details while testing the app.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  checkInCard: {
    backgroundColor: colors.surfacePink,
    borderColor: colors.surfacePink,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
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
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    paddingVertical: 15,
    marginTop: 2,
    marginBottom: 14,
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
});
