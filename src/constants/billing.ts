export const PREMIUM_PLAN_ID =
  process.env.EXPO_PUBLIC_CLERK_PREMIUM_PLAN_ID ?? "";

/** Plan slug used with auth.has({ plan }) — set in Clerk Dashboard */
export const PREMIUM_PLAN_SLUG =
  process.env.EXPO_PUBLIC_CLERK_PREMIUM_PLAN_SLUG ?? "premium";

/** Feature slug for premium saves — optional, set in Clerk Dashboard */
export const PREMIUM_FEATURE_SLUG =
  process.env.EXPO_PUBLIC_CLERK_PREMIUM_FEATURE_SLUG ?? "unlimited_saves";

export const BILLING_CONFIGURED = Boolean(PREMIUM_PLAN_ID);

export type BillingPeriod = "month" | "annual";
