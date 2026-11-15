import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  onSignOut: () => void;
};

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  onSignOut,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        onPress={onSignOut}
        style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
      >
        <Text style={styles.avatarText}>↪</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  copy: {
    flexShrink: 1,
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
    marginLeft: 12,
  },
  avatarText: {
    color: colors.mauve,
    fontSize: 22,
  },
  pressed: {
    opacity: 0.75,
  },
});
