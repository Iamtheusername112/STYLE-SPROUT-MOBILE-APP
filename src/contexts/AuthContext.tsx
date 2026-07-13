import { useAuth, useClerk, useUser } from "@clerk/expo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  BILLING_CONFIGURED,
  PREMIUM_FEATURE_SLUG,
  PREMIUM_PLAN_SLUG,
} from "@/src/constants/billing";
import { FREE_SAVE_LIMIT } from "@/src/constants/premium";

export interface AuthContextValue {
  isLoaded: boolean;
  isPremium: boolean;
  tier: "free" | "premium";
  user: ReturnType<typeof useUser>["user"] | null;
  subscriptionStatus: string | null;
  freeSaveLimit: number;
  refreshPremium: () => Promise<void>;
}

const defaultAuth: AuthContextValue = {
  isLoaded: true,
  isPremium: false,
  tier: "free",
  user: null,
  subscriptionStatus: null,
  freeSaveLimit: FREE_SAVE_LIMIT,
  refreshPremium: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuth);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={defaultAuth}>{children}</AuthContext.Provider>;
}

function useClerkPremiumAccess() {
  const { isLoaded, has } = useAuth();
  const clerk = useClerk();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadSubscription = useCallback(async () => {
    if (!BILLING_CONFIGURED || !clerk.billing) {
      setSubscriptionStatus(null);
      return;
    }

    try {
      const subscription = await clerk.billing.getSubscription({});
      setSubscriptionStatus(subscription.status ?? null);
    } catch {
      setSubscriptionStatus(null);
    }
  }, [clerk]);

  useEffect(() => {
    if (!isLoaded) return;
    void loadSubscription();
  }, [isLoaded, loadSubscription, refreshKey]);

  const refreshPremium = useCallback(async () => {
    await clerk.user?.reload();
    setRefreshKey((key) => key + 1);
  }, [clerk]);

  const hasPlan = isLoaded ? has({ plan: PREMIUM_PLAN_SLUG }) : false;
  const hasFeature = isLoaded ? has({ feature: PREMIUM_FEATURE_SLUG }) : false;
  const hasActiveSubscription = subscriptionStatus === "active";
  const isPremium = hasPlan || hasFeature || hasActiveSubscription;

  return {
    isLoaded,
    isPremium,
    subscriptionStatus,
    tier: isPremium ? ("premium" as const) : ("free" as const),
    refreshPremium,
  };
}

export function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const billingAccess = useClerkPremiumAccess();

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoaded: userLoaded && billingAccess.isLoaded,
      isPremium: billingAccess.isPremium,
      tier: billingAccess.tier,
      user: user ?? null,
      subscriptionStatus: billingAccess.subscriptionStatus,
      freeSaveLimit: FREE_SAVE_LIMIT,
      refreshPremium: billingAccess.refreshPremium,
    }),
    [billingAccess, user, userLoaded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function usePremium(): AuthContextValue {
  return useContext(AuthContext);
}
