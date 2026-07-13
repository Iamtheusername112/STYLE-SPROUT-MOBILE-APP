import {
  Bell,
  CheckCircle2,
  Crown,
  Heart,
  Sparkles,
  Tag,
  X,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { type Href, useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NOTIFICATION_KIND_LABELS } from "@/src/constants/notifications";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import type { AppNotification, NotificationKind } from "@/src/types/notification";
import { formatNotificationTime } from "@/src/utils/formatNotificationTime";

interface NotificationsSheetProps {
  visible: boolean;
  onClose: () => void;
}

const KIND_ICONS: Record<NotificationKind, LucideIcon> = {
  deal_alert: Tag,
  save: Heart,
  premium_drop: Crown,
  closet_goal: Sparkles,
  premium_upsell: Crown,
  feed_update: Sparkles,
  system: Bell,
};

export function NotificationsSheet({ visible, onClose }: NotificationsSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notifications = useNotificationStore((state) => state.notifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const dismissBanner = useNotificationStore((state) => state.dismissBanner);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const handlePress = (item: AppNotification) => {
    markRead(item.id);
    dismissBanner();
    onClose();

    if (item.href) {
      router.push(item.href as Href);
      return;
    }

    if (item.productId) {
      router.push(`/product/${item.productId}` as Href);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subtitle}>
                {unreadCount > 0
                  ? `${unreadCount} new update${unreadCount === 1 ? "" : "s"}`
                  : "You're all caught up"}
              </Text>
            </View>
            <View style={styles.headerActions}>
              {unreadCount > 0 ? (
                <Pressable style={styles.markAllBtn} onPress={markAllRead}>
                  <Text style={styles.markAllText}>Mark all read</Text>
                </Pressable>
              ) : null}
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <X size={18} color="#1A1A1A" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {notifications.length === 0 ? (
              <View style={styles.empty}>
                <Bell size={24} color="#4A6741" />
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptyText}>
                  Saves, deal drops, and style insights will show up here.
                </Text>
              </View>
            ) : (
              notifications.map((item) => {
                const Icon = KIND_ICONS[item.kind];

                return (
                  <Pressable
                    key={item.id}
                    style={[styles.item, !item.read && styles.itemUnread]}
                    onPress={() => handlePress(item)}
                  >
                    <View style={styles.itemIcon}>
                      {item.read ? (
                        <CheckCircle2 size={14} color="#A88758" />
                      ) : (
                        <Icon size={14} color="#4A6741" />
                      )}
                    </View>
                    <View style={styles.itemCopy}>
                      <View style={styles.itemTop}>
                        <Text style={styles.itemKind}>
                          {NOTIFICATION_KIND_LABELS[item.kind]}
                        </Text>
                        <Text style={styles.itemTime}>
                          {formatNotificationTime(item.createdAt)}
                        </Text>
                      </View>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemBody}>{item.body}</Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,26,26,0.45)",
  },
  sheet: {
    maxHeight: "78%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FAF7F2",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(26,26,26,0.12)",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(26,26,26,0.5)",
  },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(74,103,65,0.08)",
  },
  markAllText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4A6741",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  list: {
    paddingBottom: 8,
    gap: 10,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  itemUnread: {
    borderColor: "rgba(74,103,65,0.18)",
    backgroundColor: "rgba(74,103,65,0.04)",
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,103,65,0.1)",
  },
  itemCopy: {
    flex: 1,
    minWidth: 0,
  },
  itemTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  itemKind: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#A88758",
  },
  itemTime: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(26,26,26,0.4)",
  },
  itemTitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  itemBody: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(26,26,26,0.55)",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: "rgba(26,26,26,0.5)",
    paddingHorizontal: 20,
  },
});
