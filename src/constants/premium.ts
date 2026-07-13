import type { LucideIcon } from "lucide-react-native";
import { Crown, Heart, Sparkles, Tag, Zap } from "lucide-react-native";

/** Free members can save up to this many outfits */
export const FREE_SAVE_LIMIT = 3;

/** Product IDs that are exclusive premium drops */
export const PREMIUM_DROP_IDS = new Set([
  "ss-003",
  "ss-008",
  "ss-010",
  "ss-011",
]);

export type PremiumFeatureId =
  | "unlimited_saves"
  | "premium_drops"
  | "deal_alerts"
  | "closet_insights";

export interface PremiumFeature {
  id: PremiumFeatureId;
  label: string;
  description: string;
  icon: LucideIcon;
  freeLabel: string;
  premiumLabel: string;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: "unlimited_saves",
    label: "Closet saves",
    description: "Build your personal outfit collection",
    icon: Heart,
    freeLabel: `Up to ${FREE_SAVE_LIMIT} saves`,
    premiumLabel: "Unlimited saves",
  },
  {
    id: "premium_drops",
    label: "Exclusive drops",
    description: "Curated premium SHEIN collections",
    icon: Sparkles,
    freeLabel: "Browse only",
    premiumLabel: "Full access",
  },
  {
    id: "deal_alerts",
    label: "Deal alerts",
    description: "Price drops on saved looks",
    icon: Tag,
    freeLabel: "Not included",
    premiumLabel: "Real-time alerts",
  },
  {
    id: "closet_insights",
    label: "Closet insights",
    description: "Style breakdown & savings stats",
    icon: Zap,
    freeLabel: "Basic stats",
    premiumLabel: "Full dashboard",
  },
];

export const PLAN_COPY = {
  free: {
    name: "Sprout Free",
    price: "$0",
    period: "forever",
    tagline: "Discover and try Style Sprout",
  },
  premium: {
    name: "Sprout Premium",
    monthlyPrice: "$4.99",
    annualPrice: "$47.99",
    trial: "7-day free trial",
    tagline: "Unlock your full style wardrobe",
  },
} as const;
