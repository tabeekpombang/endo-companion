import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { colors } from "../theme/colors";

type FeaturePlaceholderProps = {
  icon: string;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
};

export function FeaturePlaceholder({
  icon,
  title,
  description,
  action,
  onAction,
}: FeaturePlaceholderProps) {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {action && onAction ? (
          <PrimaryButton label={action} onPress={onAction} />
        ) : null}
      </View>
      <Text style={styles.note}>
        No health records are saved in this prototype.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginTop: 18,
    marginBottom: 14,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfacePink,
  },
  iconText: {
    color: colors.mauve,
    fontSize: 21,
  },
  title: {
    color: colors.plum,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600",
    marginTop: 7,
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  note: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 3,
    marginBottom: 8,
  },
});
