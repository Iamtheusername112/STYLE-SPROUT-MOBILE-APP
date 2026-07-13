import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import {
  MAX_STORED_NOTIFICATIONS,
  NOTIFICATION_STORAGE_KEY,
} from "@/src/constants/notifications";
import { setBadgeCount } from "@/src/services/notificationService";
import type {
  AppNotification,
  NotificationKind,
  NotificationPreferences,
} from "@/src/types/notification";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@/src/types/notification";

interface AddNotificationInput {
  kind: NotificationKind;
  title: string;
  body: string;
  productId?: string;
  href?: string;
  dedupeKey?: string;
}

interface NotificationStore {
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  preferencesLoaded: boolean;
  pushToken: string | null;
  banner: AppNotification | null;
  loadPreferences: () => Promise<void>;
  setPreferences: (patch: Partial<NotificationPreferences>) => Promise<void>;
  setPushToken: (token: string | null) => void;
  addNotification: (input: AddNotificationInput) => AppNotification | null;
  markRead: (id: string) => void;
  markAllRead: () => void;
  showBanner: (notification: AppNotification) => void;
  dismissBanner: () => void;
  getUnreadCount: () => number;
}

function createNotificationId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function shouldDeliver(kind: NotificationKind, prefs: NotificationPreferences) {
  if (!prefs.enabled) return false;

  switch (kind) {
    case "deal_alert":
      return prefs.dealAlerts;
    case "premium_drop":
      return prefs.premiumDrops;
    case "closet_goal":
    case "save":
      return prefs.closetGoals;
    case "feed_update":
      return prefs.feedUpdates;
    case "premium_upsell":
    case "system":
      return true;
    default:
      return true;
  }
}

async function persistPreferences(preferences: NotificationPreferences) {
  await SecureStore.setItemAsync(
    NOTIFICATION_STORAGE_KEY,
    JSON.stringify(preferences),
  );
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  preferences: DEFAULT_NOTIFICATION_PREFERENCES,
  preferencesLoaded: false,
  pushToken: null,
  banner: null,

  loadPreferences: async () => {
    try {
      const raw = await SecureStore.getItemAsync(NOTIFICATION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NotificationPreferences;
        set({
          preferences: { ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed },
          preferencesLoaded: true,
        });
        return;
      }
    } catch {
      // Fall through to defaults
    }

    set({ preferencesLoaded: true });
  },

  setPreferences: async (patch) => {
    const preferences = { ...get().preferences, ...patch };
    set({ preferences });
    await persistPreferences(preferences);
  },

  setPushToken: (token) => set({ pushToken: token }),

  addNotification: (input) => {
    const { preferences, notifications } = get();
    if (!shouldDeliver(input.kind, preferences)) return null;

    if (input.dedupeKey) {
      const exists = notifications.some((item) => item.id === input.dedupeKey);
      if (exists) return null;
    }

    const notification: AppNotification = {
      id: input.dedupeKey ?? createNotificationId(),
      kind: input.kind,
      title: input.title,
      body: input.body,
      createdAt: Date.now(),
      read: false,
      productId: input.productId,
      href: input.href,
    };

    const next = [notification, ...notifications].slice(0, MAX_STORED_NOTIFICATIONS);
    const unreadCount = next.filter((item) => !item.read).length;

    set({ notifications: next });
    void setBadgeCount(unreadCount);

    return notification;
  },

  markRead: (id) => {
    const notifications = get().notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    );
    const unreadCount = notifications.filter((item) => !item.read).length;
    set({ notifications });
    void setBadgeCount(unreadCount);
  },

  markAllRead: () => {
    const notifications = get().notifications.map((item) => ({
      ...item,
      read: true,
    }));
    set({ notifications });
    void setBadgeCount(0);
  },

  showBanner: (notification) => set({ banner: notification }),

  dismissBanner: () => set({ banner: null }),

  getUnreadCount: () => get().notifications.filter((item) => !item.read).length,
}));
