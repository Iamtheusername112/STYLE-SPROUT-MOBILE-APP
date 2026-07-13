export type NotificationKind =
  | "deal_alert"
  | "save"
  | "premium_drop"
  | "closet_goal"
  | "premium_upsell"
  | "feed_update"
  | "system";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  productId?: string;
  href?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  dealAlerts: boolean;
  premiumDrops: boolean;
  closetGoals: boolean;
  feedUpdates: boolean;
  pushEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  dealAlerts: true,
  premiumDrops: true,
  closetGoals: true,
  feedUpdates: true,
  pushEnabled: true,
};
