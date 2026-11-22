import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  deleteCheckIn,
  getCheckIns,
  type CheckIn,
  type Symptom,
} from "../api/checkIns";
import { FeaturePlaceholder } from "../components/FeaturePlaceholder";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";

const symptomLabels: Record<Symptom, string> = {
  PELVIC_PAIN: "Pelvic pain",
  BLOATING: "Bloating",
  FATIGUE: "Fatigue",
  BACK_PAIN: "Back pain",
  NAUSEA: "Nausea",
};

const impactLabels = {
  NOT_AT_ALL: "Not at all",
  A_LITTLE: "A little",
  A_LOT: "A lot",
} as const;

type HistoryScreenProps = {
  onTrack: () => void;
  onEdit: (checkIn: CheckIn) => void;
  onSignOut: () => void;
  refreshKey: number;
};

export function HistoryScreen({
  onTrack,
  onEdit,
  onSignOut,
  refreshKey,
}: HistoryScreenProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getCheckIns()
      .then((items) => {
        if (active) setCheckIns(items);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : "Your check-ins could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey, retryKey]);

  return (
    <>
      <ScreenHeader
        eyebrow="YOUR EXPERIENCES, IN ONE PLACE"
        title="Your health history"
        onSignOut={onSignOut}
      />
      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Loading check-ins"
          color={colors.mauve}
          style={styles.loading}
        />
      ) : error ? (
        <View style={styles.messageCard}>
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
          <PrimaryButton
            label="Try again"
            onPress={() => setRetryKey((current) => current + 1)}
          />
        </View>
      ) : checkIns.length === 0 ? (
        <FeaturePlaceholder
          icon="◷"
          title="Your health history"
          description="Check-ins you choose to record will appear here, ready for you to review over time."
          action="Log your first check-in"
          onAction={onTrack}
        />
      ) : (
        <View>
          {checkIns.map((checkIn) => (
            <CheckInCard
              key={checkIn.id}
              checkIn={checkIn}
              onEdit={onEdit}
              onDeleted={() => setRetryKey((current) => current + 1)}
            />
          ))}
        </View>
      )}
    </>
  );
}

function CheckInCard({
  checkIn,
  onEdit,
  onDeleted,
}: {
  checkIn: CheckIn;
  onEdit: (checkIn: CheckIn) => void;
  onDeleted: () => void;
}) {
  const date = new Date(`${checkIn.recordedDate}T00:00:00`);
  const formattedDate = Number.isNaN(date.getTime())
    ? checkIn.recordedDate
    : date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const confirmDelete = () => {
    Alert.alert(
      "Delete check-in?",
      "This check-in will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCheckIn(checkIn.id)
              .then(onDeleted)
              .catch((deleteError: unknown) => {
                Alert.alert(
                  "Could not delete check-in",
                  deleteError instanceof Error
                    ? deleteError.message
                    : "Please try again.",
                );
              });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.checkInCard}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.pain}>
        Pain: {checkIn.painLevel}/10
      </Text>
      <Text style={styles.detail}>
        Daily impact: {impactLabels[checkIn.dailyImpact]}
      </Text>
      {checkIn.symptoms.length > 0 ? (
        <Text style={styles.detail}>
          Symptoms: {checkIn.symptoms.map((symptom) => symptomLabels[symptom]).join(", ")}
        </Text>
      ) : null}
      {checkIn.notes ? <Text style={styles.notes}>{checkIn.notes}</Text> : null}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onEdit(checkIn)}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Text style={styles.editAction}>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={confirmDelete}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Text style={styles.deleteAction}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 36,
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
  },
  error: {
    color: "#A13C45",
    fontSize: 13,
    lineHeight: 19,
  },
  checkInCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
  },
  date: {
    color: colors.mauve,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.35,
    textTransform: "uppercase",
  },
  pain: {
    color: colors.plum,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 9,
  },
  detail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  notes: {
    color: colors.plum,
    fontSize: 13,
    lineHeight: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 14,
  },
  actionButton: {
    minHeight: 36,
    minWidth: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  editAction: {
    color: colors.mauve,
    fontSize: 13,
    fontWeight: "600",
  },
  deleteAction: {
    color: "#A13C45",
    fontSize: 13,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.65,
  },
});
