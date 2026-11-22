import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  createCheckIn,
  updateCheckIn,
  type CheckIn,
  type DailyImpact,
  type Symptom,
} from "../api/checkIns";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";

const painLevels = Array.from({ length: 11 }, (_, level) => level);

const impacts: { value: DailyImpact; label: string }[] = [
  { value: "NOT_AT_ALL", label: "Not at all" },
  { value: "A_LITTLE", label: "A little" },
  { value: "A_LOT", label: "A lot" },
];

const symptoms: { value: Symptom; label: string }[] = [
  { value: "PELVIC_PAIN", label: "Pelvic pain" },
  { value: "BLOATING", label: "Bloating" },
  { value: "FATIGUE", label: "Fatigue" },
  { value: "BACK_PAIN", label: "Back pain" },
  { value: "NAUSEA", label: "Nausea" },
];

type TrackScreenProps = {
  onSaved: () => void;
  onSignOut: () => void;
  checkInToEdit?: CheckIn;
};

function getToday() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function TrackScreen({ onSaved, onSignOut, checkInToEdit }: TrackScreenProps) {
  const [recordedDate, setRecordedDate] = useState(checkInToEdit?.recordedDate ?? getToday);
  const [painLevel, setPainLevel] = useState<number | null>(checkInToEdit?.painLevel ?? null);
  const [dailyImpact, setDailyImpact] = useState<DailyImpact | null>(checkInToEdit?.dailyImpact ?? null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>(checkInToEdit?.symptoms ?? []);
  const [notes, setNotes] = useState(checkInToEdit?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms((selected) => selected.includes(symptom)
      ? selected.filter((item) => item !== symptom)
      : [...selected, symptom]);
  };

  const handleSave = async () => {
    if (!isValidDate(recordedDate)) {
      setError("Enter a valid date in YYYY-MM-DD format.");
      return;
    }
    if (painLevel === null || dailyImpact === null) {
      setError("Choose a pain level and how symptoms affected your day.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const checkIn = {
        recordedDate,
        painLevel,
        dailyImpact,
        symptoms: selectedSymptoms,
        notes: notes.trim() || null,
      };
      if (checkInToEdit) {
        await updateCheckIn(checkInToEdit.id, checkIn);
      } else {
        await createCheckIn(checkIn);
      }
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error
        ? saveError.message
        : "Your check-in could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScreenHeader
        eyebrow="YOUR PRIVATE SPACE"
        title={checkInToEdit ? "Edit your check-in" : "How are you feeling?"}
        onSignOut={onSignOut}
      />

      <View style={styles.card}>
        <Text style={styles.intro}>
          Your check-in is a personal record, not a diagnosis. Share only what
          feels useful to you.
        </Text>

        <Text style={styles.label}>Date</Text>
        <TextInput
          accessibilityLabel="Check-in date"
          value={recordedDate}
          onChangeText={setRecordedDate}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          style={styles.textInput}
        />

        <Text style={styles.label}>Pain level</Text>
        <Text style={styles.helper}>0 means no pain; 10 is the most severe.</Text>
        <View style={styles.choiceRow}>
          {painLevels.map((level) => (
            <Choice
              key={level}
              label={String(level)}
              selected={painLevel === level}
              onPress={() => setPainLevel(level)}
              accessibilityLabel={`Pain level ${level}`}
            />
          ))}
        </View>

        <Text style={styles.label}>How much did symptoms affect your day?</Text>
        <View style={styles.choiceRow}>
          {impacts.map((impact) => (
            <Choice
              key={impact.value}
              label={impact.label}
              selected={dailyImpact === impact.value}
              onPress={() => setDailyImpact(impact.value)}
            />
          ))}
        </View>

        <Text style={styles.label}>What did you experience?</Text>
        <Text style={styles.helper}>Choose any that apply.</Text>
        <View style={styles.choiceRow}>
          {symptoms.map((symptom) => (
            <Choice
              key={symptom.value}
              label={symptom.label}
              selected={selectedSymptoms.includes(symptom.value)}
              onPress={() => toggleSymptom(symptom.value)}
            />
          ))}
        </View>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          accessibilityLabel="Optional check-in notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything else you want to remember?"
          multiline
          maxLength={2000}
          textAlignVertical="top"
          style={[styles.textInput, styles.notesInput]}
        />
        <Text style={styles.helper}>{notes.length}/2000</Text>

        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        {saving ? (
          <ActivityIndicator
            accessibilityLabel="Saving check-in"
            color={colors.mauve}
            style={styles.spinner}
          />
        ) : (
          <PrimaryButton
            label={checkInToEdit ? "Save changes" : "Save check-in"}
            onPress={handleSave}
          />
        )}
      </View>
      <Text style={styles.privacyNote}>
        Your check-ins are saved to your account.
      </Text>
    </>
  );
}

type ChoiceProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

function Choice({ label, selected, onPress, accessibilityLabel }: ChoiceProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        selected && styles.selectedChoice,
        pressed && styles.pressedChoice,
      ]}
    >
      <Text style={[styles.choiceText, selected && styles.selectedChoiceText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    marginBottom: 14,
  },
  intro: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  label: {
    color: colors.plum,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 7,
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 7,
  },
  textInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.plum,
    backgroundColor: colors.background,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  notesInput: {
    minHeight: 100,
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 3,
  },
  choice: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
  },
  selectedChoice: {
    borderColor: colors.mauve,
    backgroundColor: colors.surfacePink,
  },
  choiceText: {
    color: colors.muted,
    fontSize: 13,
  },
  selectedChoiceText: {
    color: colors.plum,
    fontWeight: "600",
  },
  pressedChoice: {
    opacity: 0.75,
  },
  error: {
    color: "#A13C45",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  spinner: {
    marginTop: 22,
  },
  privacyNote: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 3,
    marginBottom: 8,
  },
});
