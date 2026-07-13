import { type Href, useRouter } from "expo-router";
import { CheckCircle2, Crown, Sparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/src/components/ui/AppButton";
import { PREMIUM_FEATURES } from "@/src/constants/premium";

export default function SubscriptionSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.iconWrap}>
        <CheckCircle2 size={40} color="#4A6741" />
      </View>

      <Text style={styles.eyebrow}>WELCOME TO PREMIUM</Text>
      <Text style={styles.title}>You&apos;re all unlocked</Text>
      <Text style={styles.copy}>
        Your Sprout Premium membership is active. Start saving unlimited looks,
        shop exclusive drops, and get deal alerts first.
      </Text>

      <View style={styles.perks}>
        {PREMIUM_FEATURES.map((feature) => (
          <View key={feature.id} style={styles.perkRow}>
            <Sparkles size={14} color="#4A6741" />
            <Text style={styles.perkText}>{feature.premiumLabel}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cta}>
        <AppButton
          label="Go to dashboard"
          icon={Crown}
          variant="gold"
          showArrow={false}
          onPress={() => router.replace("/(tabs)/profile" as Href)}
        />
        <View style={styles.secondarySpacing}>
          <AppButton
            label="Browse exclusive drops"
            variant="secondary"
            showArrow={false}
            onPress={() => router.replace("/(tabs)" as Href)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,103,65,0.12)",
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#C9A87C",
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
  },
  copy: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "rgba(26,26,26,0.55)",
    maxWidth: 320,
  },
  perks: {
    width: "100%",
    marginTop: 24,
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  perkText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  cta: {
    width: "100%",
    marginTop: 24,
  },
  secondarySpacing: {
    marginTop: 10,
  },
});
