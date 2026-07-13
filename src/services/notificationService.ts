import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { NOTIFICATION_CHANNEL_IDS } from "@/src/constants/notifications";
import type { AppNotification, NotificationKind } from "@/src/types/notification";

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function setupAndroidChannels() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_IDS.deals, {
    name: "Deal alerts",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#4A6741",
  });

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_IDS.drops, {
    name: "Premium drops",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#C9A87C",
  });

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_IDS.closet, {
    name: "Closet updates",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#4A6741",
  });

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_IDS.general, {
    name: "Style Sprout",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#4A6741",
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice && Platform.OS !== "web") {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

function channelForKind(kind: NotificationKind): string {
  switch (kind) {
    case "deal_alert":
      return NOTIFICATION_CHANNEL_IDS.deals;
    case "premium_drop":
      return NOTIFICATION_CHANNEL_IDS.drops;
    case "save":
    case "closet_goal":
      return NOTIFICATION_CHANNEL_IDS.closet;
    default:
      return NOTIFICATION_CHANNEL_IDS.general;
  }
}

export async function presentLocalNotification(notification: AppNotification) {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: {
        notificationId: notification.id,
        kind: notification.kind,
        productId: notification.productId,
        href: notification.href,
      },
      sound: true,
    },
    trigger: null,
    ...(Platform.OS === "android"
      ? { channelId: channelForKind(notification.kind) }
      : {}),
  });
}

export async function scheduleDealReminder(
  notification: AppNotification,
  secondsFromNow = 90,
) {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: {
        notificationId: notification.id,
        kind: notification.kind,
        productId: notification.productId,
        href: notification.href,
      },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow,
      repeats: false,
    },
    ...(Platform.OS === "android"
      ? { channelId: NOTIFICATION_CHANNEL_IDS.deals }
      : {}),
  });
}

export async function setBadgeCount(count: number) {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch {
    // Badge unsupported on this platform
  }
}

export function parseNotificationResponse(
  response: Notifications.NotificationResponse,
): { notificationId?: string; productId?: string; href?: string } {
  const data = response.notification.request.content.data;
  return {
    notificationId:
      typeof data.notificationId === "string" ? data.notificationId : undefined,
    productId: typeof data.productId === "string" ? data.productId : undefined,
    href: typeof data.href === "string" ? data.href : undefined,
  };
}
