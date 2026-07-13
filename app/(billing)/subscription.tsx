import { useAuth, useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ArrowLeft, Crown } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlanComparisonCard } from "@/src/components/billing/PlanComparisonCard";
import { AppButton } from "@/src/components/ui/AppButton";
import { BILLING_CONFIGURED } from "@/src/constants/billing";
import { PREMIUM_FEATURES } from "@/src/constants/premium";
import { usePremium } from "@/src/contexts/AuthContext";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";

type SubscriptionSnapshot = {
  status: string;
  planName: string;
  nextPaymentDate: Date | null;
  nextPaymentAmount: string | null;
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const { isPremium, refreshPremium } = usePremium();
  const { openCheckout, openPlans } = usePremiumCheckout();
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubscription = useCallback(async () => {
    if (!BILLING_CONFIGURED || !clerk.billing) {
      setSubscription(null);
      return;
    }

    const data = await clerk.billing.getSubscription({});
    const premiumItem = data.subscriptionItems.find(
      (item) => item.status === "active" && item.plan,
    );

    setSubscription({
      status: data.status,
      planName: premiumItem?.plan.name ?? "Sprout Premium",
      nextPaymentDate: data.nextPayment?.date ?? null,
      nextPaymentAmount: data.nextPayment?.amount.amountFormatted ?? null,
    });
  }, [clerk]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    void loadSubscription()
      .catch(() => setSubscription(null))
      .finally(() => setIsLoading(false));
  }, [isLoaded, isSignedIn, loadSubscription]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPremium();
    try {
      await loadSubscription();
    } catch {
      setSubscription(null);
    }
    setRefreshing(false);
  };

  if (!isLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color="#4A6741" size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const isActive = isPremium && subscription?.status === "active";

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {isLoading ? (
          <ActivityIndicator color="#4A6741" style={{ marginTop: 40 }} />
        ) : isActive && subscription ? (
          <>
            <View style={styles.activeCard}>
              <View style={styles.activeBadge}>
                <Crown size={14} color="#FFFFFF" />
                <Text style={styles.activeBadgeText}>Premium active</Text>
              </View>
              <Text style={styles.planName}>{subscription.planName}</Text>
              <Text style={styles.meta}>
                Renews {formatDate(subscription.nextPaymentDate)}
              </Text>
              {subscription.nextPaymentAmount ? (
                <Text style={styles.meta}>
                  Next charge {subscription.nextPaymentAmount}
                </Text>
              ) : null}
            </View>

            <Text style={styles.sectionLabel}>Your perks</Text>
            <View style={styles.perksCard}>
              {PREMIUM_FEATURES.map((feature) => (
                <View key={feature.id} style={styles.perkRow}>
                  <Text style={styles.perkLabel}>{feature.label}</Text>
                  <Text style={styles.perkValue}>{feature.premiumLabel}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.upgradeIntro}>
              You&apos;re on the free plan. Upgrade to unlock the full Style
              Sprout experience.
            </Text>
            <PlanComparisonCard
              variant="free"
              isCurrentPlan={!isPremium}
            />
            <PlanComparisonCard
              variant="premium"
              isCurrentPlan={isPremium}
              onSelect={() => openCheckout("month")}
            />
            {!isPremium ? (
              <View style={styles.upgradeCta}>
                <AppButton
                  label="Compare plans"
                  variant="secondary"
                  showArrow={false}
                  onPress={() => openPlans()}
                />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7F2", paddingHorizontal: 20 },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  activeCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(201,168,124,0.3)",
    marginBottom: 20,
  },
  activeBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#C9A87C",
    marginBottom: 12,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  planName: { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  meta: { marginTop: 6, fontSize: 13, color: "rgba(26,26,26,0.55)" },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.4)",
  },
  perksCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
    gap: 12,
  },
  perkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  perkLabel: { fontSize: 13, fontWeight: "600", color: "#1A1A1A" },
  perkValue: { fontSize: 12, fontWeight: "600", color: "#4A6741" },
  upgradeIntro: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(26,26,26,0.55)",
    marginBottom: 16,
  },
  upgradeCta: {
    marginTop: 12,
  },
});
