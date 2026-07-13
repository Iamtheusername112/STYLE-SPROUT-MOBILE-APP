import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlanComparisonCard } from "@/src/components/billing/PlanComparisonCard";
import { usePremium } from "@/src/contexts/AuthContext";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";

export default function PlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn } = useAuth();
  const { isPremium } = usePremium();
  const { openCheckout } = usePremiumCheckout();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Choose your plan</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <Text style={styles.intro}>
          Start free, then upgrade when you&apos;re ready for unlimited saves,
          exclusive drops, and deal alerts.
        </Text>

        <PlanComparisonCard variant="free" isCurrentPlan={!isPremium} />

        <PlanComparisonCard
          variant="premium"
          isCurrentPlan={isPremium}
          onSelect={() => openCheckout("month")}
        />

        <Text style={styles.footnote}>
          Secure checkout powered by Clerk Billing & Stripe. Cancel anytime from
          your subscription settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  intro: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(26,26,26,0.55)",
    marginBottom: 18,
  },
  footnote: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: "rgba(26,26,26,0.4)",
    paddingHorizontal: 12,
  },
});
