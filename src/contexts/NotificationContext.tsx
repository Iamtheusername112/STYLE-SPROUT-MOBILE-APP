import * as Notifications from "expo-notifications";
import { type Href, useRouter } from "expo-router";
import { createContext, useContext, useEffect, type ReactNode } from "react";

import { useNotificationSync } from "@/src/hooks/useNotificationSync";
import {
  configureNotificationHandler,
  getExpoPushToken,
  parseNotificationResponse,
  requestNotificationPermissions,
  setupAndroidChannels,
} from "@/src/services/notificationService";
import { useNotificationStore } from "@/src/store/useNotificationStore";

interface NotificationContextValue {
  unreadCount: number;
  requestPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  requestPermissions: async () => false,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loadPreferences = useNotificationStore((state) => state.loadPreferences);
  const setPushToken = useNotificationStore((state) => state.setPushToken);
  const markRead = useNotificationStore((state) => state.markRead);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const unreadCount = useNotificationStore((state) =>
    state.notifications.filter((item) => !item.read).length,
  );

  useNotificationSync();

  useEffect(() => {
    configureNotificationHandler();
    void setupAndroidChannels();
    void loadPreferences();
    void requestNotificationPermissions();
    void getExpoPushToken().then(setPushToken);
  }, [loadPreferences, setPushToken]);

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        const kind = typeof data.kind === "string" ? data.kind : "system";

        addNotification({
          kind: kind as Parameters<typeof addNotification>[0]["kind"],
          title: notification.request.content.title ?? "Style Sprout",
          body: notification.request.content.body ?? "",
          productId:
            typeof data.productId === "string" ? data.productId : undefined,
          href: typeof data.href === "string" ? data.href : undefined,
          dedupeKey:
            typeof data.notificationId === "string"
              ? data.notificationId
              : undefined,
        });
      },
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { notificationId, productId, href } =
          parseNotificationResponse(response);

        if (notificationId) {
          markRead(notificationId);
        }

        if (href) {
          router.push(href as Href);
          return;
        }

        if (productId) {
          router.push(`/product/${productId}` as Href);
        }
      },
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [addNotification, markRead, router]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        requestPermissions: requestNotificationPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
