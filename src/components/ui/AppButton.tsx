import { LinearGradient } from "expo-linear-gradient";
import type { LucideIcon } from "lucide-react-native";
import { ArrowRight } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "gold"
  | "outline"
  | "ghost";

export type AppButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ICON_SLOT = 36;

const SIZE_STYLES = {
  sm: {
    minHeight: 40,
    fontSize: 13,
    iconSize: 14,
    iconWrap: 28,
    arrowWrap: 24,
    paddingVertical: 10,
  },
  md: {
    minHeight: 56,
    fontSize: 15,
    iconSize: 16,
    iconWrap: 32,
    arrowWrap: 28,
    paddingVertical: 14,
  },
  lg: {
    minHeight: 60,
    fontSize: 16,
    iconSize: 18,
    iconWrap: 36,
    arrowWrap: 32,
    paddingVertical: 16,
  },
} as const;

export function AppButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  showArrow = true,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const sizing = SIZE_STYLES[size];

  if (variant === "ghost") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.ghost,
          { opacity: isDisabled ? 0.5 : pressed ? 0.7 : 1 },
          style,
        ]}
      >
        <Text style={[styles.ghostLabel, { fontSize: sizing.fontSize }]}>{label}</Text>
      </Pressable>
    );
  }

  if (variant === "secondary" || variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.secondaryOuter,
          variant === "outline" && styles.outlineOuter,
          { opacity: isDisabled ? 0.55 : pressed ? 0.92 : 1 },
          style,
        ]}
      >
        <View
          style={[
            styles.secondaryInner,
            {
              minHeight: sizing.minHeight,
              paddingVertical: sizing.paddingVertical,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#4A6741" />
          ) : (
            <>
              <View style={styles.iconSlot}>
                {Icon ? (
                  <View
                    style={[
                      styles.secondaryIconWrap,
                      {
                        width: sizing.iconWrap,
                        height: sizing.iconWrap,
                        borderRadius: sizing.iconWrap / 2,
                      },
                    ]}
                  >
                    <Icon size={sizing.iconSize} color="#4A6741" />
                  </View>
                ) : null}
              </View>
              <Text
                style={[styles.secondaryLabel, { fontSize: sizing.fontSize }]}
                numberOfLines={1}
              >
                {label}
              </Text>
              <View style={styles.iconSlot}>
                {showArrow ? (
                  <ArrowRight size={sizing.iconSize - 2} color="#4A6741" strokeWidth={2.5} />
                ) : null}
              </View>
            </>
          )}
        </View>
      </Pressable>
    );
  }

  const colors =
    variant === "gold"
      ? (["#C9A87C", "#A88758", "#B8956A"] as const)
      : (["#5A7A50", "#4A6741", "#3D5636"] as const);

  const shadowColor = variant === "gold" ? "#C9A87C" : "#4A6741";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.primaryOuter,
        {
          shadowColor,
          opacity: isDisabled ? 0.65 : pressed ? 0.94 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.primaryGradient,
          {
            minHeight: sizing.minHeight,
            paddingVertical: sizing.paddingVertical,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <View style={styles.primaryRow}>
            <View style={styles.iconSlot}>
              {Icon ? (
                <View
                  style={[
                    styles.primaryIconWrap,
                    {
                      width: sizing.iconWrap,
                      height: sizing.iconWrap,
                      borderRadius: sizing.iconWrap / 2,
                    },
                  ]}
                >
                  <Icon size={sizing.iconSize} color="#FFFFFF" />
                </View>
              ) : null}
            </View>

            <Text
              style={[styles.primaryLabel, { fontSize: sizing.fontSize }]}
              numberOfLines={1}
            >
              {label}
            </Text>

            <View style={styles.iconSlot}>
              {showArrow ? (
                <View
                  style={[
                    styles.arrowWrap,
                    {
                      width: sizing.arrowWrap,
                      height: sizing.arrowWrap,
                      borderRadius: sizing.arrowWrap / 2,
                    },
                  ]}
                >
                  <ArrowRight
                    size={sizing.iconSize - 2}
                    color="#FFFFFF"
                    strokeWidth={2.5}
                  />
                </View>
              ) : null}
            </View>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export interface AppTextLinkProps {
  prompt: string;
  action: string;
  onPress: () => void;
}

export function AppTextLink({ prompt, action, onPress }: AppTextLinkProps) {
  return (
    <Pressable onPress={onPress} style={styles.textLink}>
      <Text style={styles.textLinkPrompt}>{prompt} </Text>
      <Text style={styles.textLinkAction}>{action}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryOuter: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryGradient: {
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryLabel: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#FFFFFF",
  },
  primaryIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  arrowWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  iconSlot: {
    width: ICON_SLOT,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryOuter: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "rgba(26,26,26,0.1)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  outlineOuter: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  secondaryInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  secondaryIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
  },
  secondaryLabel: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#1A1A1A",
  },
  ghost: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  ghostLabel: {
    fontWeight: "600",
    color: "rgba(26,26,26,0.45)",
  },
  textLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  textLinkPrompt: {
    fontSize: 14,
    color: "rgba(26,26,26,0.45)",
  },
  textLinkAction: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A6741",
  },
});
