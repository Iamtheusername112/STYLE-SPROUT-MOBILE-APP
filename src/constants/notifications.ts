import type { NotificationKind } from "@/src/types/notification";

export const NOTIFICATION_STORAGE_KEY = "style_sprout_notification_prefs";
export const MAX_STORED_NOTIFICATIONS = 50;

export const NOTIFICATION_CHANNEL_IDS = {
  deals: "deal-alerts",
  drops: "premium-drops",
  closet: "closet-updates",
  general: "general",
} as const;

export const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string> = {
  deal_alert: "Deal alert",
  save: "Closet save",
  premium_drop: "Premium drop",
  closet_goal: "Closet goal",
  premium_upsell: "Premium",
  feed_update: "New looks",
  system: "Update",
};
