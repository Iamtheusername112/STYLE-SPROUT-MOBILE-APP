import { Crown, Lock } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";

interface PremiumLockedOverlayProps {
  title: string;
  description: string;
  onUpgrade: () => void;
  compact?: boolean;
}

export function PremiumLockedOverlay({
  title,
  description,
  onUpgrade,
  compact,
}: PremiumLockedOverlayProps) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.iconWrap}>
        {compact ? (
          <Lock size={16} color="#C9A87C" />
        ) : (
          <Crown size={20} color="#C9A87C" />
        )}
      </View>
      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
      <Text style={[styles.description, compact && styles.descriptionCompact]}>
        {description}
      </Text>
      <View style={compact ? styles.btnCompact : styles.btn}>
        <AppButton
          label="Upgrade to Premium"
          icon={Crown}
          variant="gold"
          size={compact ? "sm" : "md"}
          showArrow={false}
          onPress={onUpgrade}
        />
      </View>
    </View>
  );
}

interface PremiumLockedCardProps extends PremiumLockedOverlayProps {
  onPress?: () => void;
}

export function PremiumLockedCard(props: PremiumLockedCardProps) {
  return (
    <Pressable onPress={props.onPress} style={styles.card}>
      <PremiumLockedOverlay {...props} compact />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  wrapCompact: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(201,168,124,0.25)",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,124,0.15)",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
  },
  titleCompact: {
    fontSize: 15,
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(26,26,26,0.55)",
    textAlign: "center",
  },
  descriptionCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
  btn: {
    width: "100%",
    marginTop: 16,
  },
  btnCompact: {
    width: "100%",
    marginTop: 12,
  },
});
