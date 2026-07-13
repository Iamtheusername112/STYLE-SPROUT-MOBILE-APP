import { useAuth } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

import { BILLING_CONFIGURED } from "@/src/constants/billing";
import type { BillingPeriod } from "@/src/constants/billing";

export function usePremiumCheckout() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const requireAuth = useCallback(() => {
    if (!isSignedIn) {
      router.push("/(auth)/sign-in" as Href);
      return false;
    }
    return true;
  }, [isSignedIn, router]);

  const requireBilling = useCallback(() => {
    if (!BILLING_CONFIGURED) {
      Alert.alert(
        "Billing not configured",
        "Enable Clerk Billing and add EXPO_PUBLIC_CLERK_PREMIUM_PLAN_ID to your .env file.",
      );
      return false;
    }
    return true;
  }, []);

  const openPlans = useCallback(() => {
    if (!requireAuth()) return;
    router.push("/(billing)/plans" as Href);
  }, [requireAuth, router]);

  const openCheckout = useCallback(
    (period: BillingPeriod = "month") => {
      if (!requireAuth() || !requireBilling()) return;
      router.push(`/(billing)/checkout?period=${period}` as Href);
    },
    [requireAuth, requireBilling, router],
  );

  const openSubscription = useCallback(() => {
    if (!requireAuth()) return;
    router.push("/(billing)/subscription" as Href);
  }, [requireAuth, router]);

  const openSuccess = useCallback(() => {
    router.replace("/(billing)/success" as Href);
  }, [router]);

  return {
    openPlans,
    openCheckout,
    openSubscription,
    openSuccess,
    billingConfigured: BILLING_CONFIGURED,
  };
}
