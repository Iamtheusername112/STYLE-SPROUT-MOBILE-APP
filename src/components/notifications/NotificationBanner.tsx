import { type Href, useRouter } from "expo-router";
import { Bell, X } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NOTIFICATION_KIND_LABELS } from "@/src/constants/notifications";
import { useNotificationStore } from "@/src/store/useNotificationStore";

export function NotificationBanner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const banner = useNotificationStore((state) => state.banner);
  const dismissBanner = useNotificationStore((state) => state.dismissBanner);
  const markRead = useNotificationStore((state) => state.markRead);

  if (!banner) return null;

  const handlePress = () => {
    markRead(banner.id);
    dismissBanner();

    if (banner.href) {
      router.push(banner.href as Href);
      return;
    }

    if (banner.productId) {
      router.push(`/product/${banner.productId}` as Href);
    }
  };

  return (
    <View style={[styles.wrap, { top: insets.top + 8 }]}>
      <Pressable style={styles.card} onPress={handlePress}>
        <View style={styles.iconWrap}>
          <Bell size={16} color="#4A6741" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>
            {NOTIFICATION_KIND_LABELS[banner.kind]}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {banner.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {banner.body}
          </Text>
        </View>
        <Pressable
          style={styles.closeBtn}
          onPress={(event) => {
            event.stopPropagation();
            dismissBanner();
          }}
          hitSlop={8}
        >
          <X size={16} color="#1A1A1A" />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(74,103,65,0.18)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,103,65,0.1)",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#A88758",
  },
  title: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  body: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(26,26,26,0.55)",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
  },
});
