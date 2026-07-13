import { useAuth, useClerk } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Crown, ShieldCheck, Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/src/components/ui/AppButton";
import { PREMIUM_FEATURES } from "@/src/constants/premium";
import {
  BILLING_CONFIGURED,
  PREMIUM_PLAN_ID,
  type BillingPeriod,
} from "@/src/constants/billing";
import { usePremium } from "@/src/contexts/AuthContext";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";

type CheckoutSession = Awaited<
  ReturnType<NonNullable<ReturnType<typeof useClerk>["billing"]>["startCheckout"]>
>;

type PaymentMethod = {
  id: string;
  last4: string | null;
  cardType: string | null;
  isDefault?: boolean;
};

function formatMoney(amount: { amountFormatted: string } | null | undefined) {
  if (!amount) return "—";
  return amount.amountFormatted;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const { refreshPremium } = usePremium();
  const { openSuccess } = usePremiumCheckout();
  const params = useLocalSearchParams<{ period?: string }>();
  const [period, setPeriod] = useState<BillingPeriod>(
    params.period === "annual" ? "annual" : "month",
  );

  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !BILLING_CONFIGURED || !clerk.billing) return;

    let cancelled = false;

    const prepareCheckout = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setCheckout(null);

      try {
        const session = await clerk.billing.startCheckout({
          planId: PREMIUM_PLAN_ID,
          planPeriod: period,
        });

        const methods = await clerk.user
          ?.getPaymentMethods()
          .then((response) => response.data ?? [])
          .catch(() => []);

        if (cancelled) return;

        setCheckout(session);
        setPaymentMethods(methods ?? []);
        const defaultMethod =
          methods?.find((method) => method.isDefault) ?? methods?.[0] ?? null;
        setSelectedMethodId(defaultMethod?.id ?? null);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to start checkout. Check Clerk Billing setup.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void prepareCheckout();
    return () => {
      cancelled = true;
    };
  }, [clerk, isLoaded, isSignedIn, period]);

  const handleConfirm = async () => {
    if (!checkout) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let confirmParams:
        | { paymentMethodId: string }
        | { useTestCard: true; gateway: "stripe" };

      if (selectedMethodId && checkout.needsPaymentMethod === false) {
        confirmParams = { paymentMethodId: selectedMethodId };
      } else if (__DEV__) {
        confirmParams = { useTestCard: true, gateway: "stripe" };
      } else if (selectedMethodId) {
        confirmParams = { paymentMethodId: selectedMethodId };
      } else {
        setErrorMessage("Add a payment method to continue.");
        return;
      }

      const updatedCheckout = await checkout.confirm(confirmParams);
      if (updatedCheckout.status !== "completed") {
        setErrorMessage("Payment could not be confirmed. Please try again.");
        return;
      }

      await refreshPremium();
      openSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Checkout failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

  if (!BILLING_CONFIGURED) {
    return (
      <View style={styles.boot}>
        <Text style={styles.setupTitle}>Billing not configured</Text>
        <Text style={styles.setupCopy}>
          Add EXPO_PUBLIC_CLERK_PREMIUM_PLAN_ID to your environment file.
        </Text>
      </View>
    );
  }

  const planName = checkout?.plan.name ?? "Sprout Premium";
  const trialDays = checkout?.plan.freeTrialDays ?? null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Secure checkout</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.steps}>
          <Text style={styles.stepActive}>1. Plan</Text>
          <Text style={styles.stepDivider}>→</Text>
          <Text style={styles.stepActive}>2. Payment</Text>
          <Text style={styles.stepDivider}>→</Text>
          <Text style={styles.stepMuted}>3. Confirm</Text>
        </View>

        <View style={styles.periodToggle}>
          <Pressable
            style={[styles.periodBtn, period === "month" && styles.periodBtnActive]}
            onPress={() => setPeriod("month")}
          >
            <Text
              style={[
                styles.periodBtnText,
                period === "month" && styles.periodBtnTextActive,
              ]}
            >
              Monthly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.periodBtn, period === "annual" && styles.periodBtnActive]}
            onPress={() => setPeriod("annual")}
          >
            <Text
              style={[
                styles.periodBtnText,
                period === "annual" && styles.periodBtnTextActive,
              ]}
            >
              Annual
            </Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Crown size={18} color="#C9A87C" />
            <Text style={styles.summaryTitle}>{planName}</Text>
          </View>
          <Text style={styles.summaryPrice}>
            {formatMoney(checkout?.totals.grandTotal)}
            <Text style={styles.summaryPeriod}>
              /{period === "annual" ? "year" : "month"}
            </Text>
          </Text>
          {trialDays ? (
            <Text style={styles.trial}>
              Includes {trialDays}-day free trial — you won&apos;t be charged today
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What you unlock</Text>
          {PREMIUM_FEATURES.map((feature) => (
            <View key={feature.id} style={styles.featureRow}>
              <Sparkles size={14} color="#4A6741" />
              <Text style={styles.featureText}>{feature.premiumLabel}</Text>
            </View>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#4A6741" />
            <Text style={styles.loadingText}>Preparing secure checkout…</Text>
          </View>
        ) : null}

        {paymentMethods.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Payment method</Text>
            {paymentMethods.map((method) => (
              <Pressable
                key={method.id}
                onPress={() => setSelectedMethodId(method.id)}
                style={[
                  styles.methodCard,
                  selectedMethodId === method.id && styles.methodCardActive,
                ]}
              >
                <Text style={styles.methodTitle}>
                  {method.cardType ?? "Card"} •••• {method.last4 ?? "----"}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {__DEV__ && Platform.OS !== "web" ? (
          <View style={styles.devNote}>
            <Text style={styles.devNoteText}>
              Development mode uses Clerk&apos;s Stripe test card.
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.trustRow}>
          <ShieldCheck size={14} color="#4A6741" />
          <Text style={styles.trustText}>
            Encrypted payment · Cancel anytime
          </Text>
        </View>

        <View style={styles.cta}>
          <AppButton
            label={
              isSubmitting
                ? "Processing…"
                : trialDays
                  ? "Start free trial"
                  : "Subscribe now"
            }
            icon={Crown}
            variant="gold"
            loading={isSubmitting}
            disabled={isSubmitting || isLoading || !checkout}
            showArrow={false}
            onPress={() => void handleConfirm()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7F2" },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FAF7F2",
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  setupCopy: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(26,26,26,0.55)",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  stepActive: { fontSize: 11, fontWeight: "700", color: "#4A6741" },
  stepMuted: { fontSize: 11, fontWeight: "600", color: "rgba(26,26,26,0.35)" },
  stepDivider: { fontSize: 11, color: "rgba(26,26,26,0.25)" },
  periodToggle: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 4,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  periodBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  periodBtnActive: { backgroundColor: "rgba(74,103,65,0.12)" },
  periodBtnText: { fontSize: 13, fontWeight: "600", color: "rgba(26,26,26,0.45)" },
  periodBtnTextActive: { color: "#4A6741" },
  summaryCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(201,168,124,0.25)",
  },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryTitle: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  summaryPrice: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    color: "#4A6741",
  },
  summaryPeriod: { fontSize: 14, fontWeight: "500", color: "rgba(26,26,26,0.45)" },
  trial: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#A88758",
    lineHeight: 17,
  },
  section: { marginTop: 18, marginHorizontal: 20 },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.4)",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  featureText: { fontSize: 13, fontWeight: "600", color: "#1A1A1A" },
  loading: { alignItems: "center", paddingVertical: 24, gap: 10 },
  loadingText: { fontSize: 13, color: "rgba(26,26,26,0.5)" },
  methodCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  methodCardActive: {
    borderColor: "rgba(74,103,65,0.35)",
    backgroundColor: "rgba(74,103,65,0.04)",
  },
  methodTitle: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
  devNote: {
    marginTop: 12,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(74,103,65,0.08)",
  },
  devNoteText: { fontSize: 12, color: "#4A6741" },
  errorBox: {
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(180,60,60,0.08)",
  },
  errorText: { fontSize: 12, lineHeight: 17, color: "#8F2D2D" },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  trustText: { fontSize: 11, fontWeight: "500", color: "rgba(26,26,26,0.45)" },
  cta: { marginTop: 16, marginHorizontal: 20 },
});
