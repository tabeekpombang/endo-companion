import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.mauve,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 18,
  },
  label: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.75,
  },
});
