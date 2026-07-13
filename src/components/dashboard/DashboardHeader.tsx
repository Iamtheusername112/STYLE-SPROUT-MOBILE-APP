import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Crown } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DashboardHeaderProps {
  greeting: string;
  subtitle: string;
  displayName: string;
  email: string;
  initials: string;
  imageUrl?: string | null;
  isPremium: boolean;
  memberSince: string;
  unreadCount: number;
  onNotificationsPress: () => void;
}

export function DashboardHeader({
  greeting,
  subtitle,
  displayName,
  email,
  initials,
  imageUrl,
  isPremium,
  memberSince,
  unreadCount,
  onNotificationsPress,
}: DashboardHeaderProps) {
  const insets = useSafeAreaInsets();
  const firstName = displayName.split(" ")[0];

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 16 }]}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
        }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={["rgba(26,26,26,0.35)", "rgba(26,26,26,0.88)", "#FAF7F2"]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>MY DASHBOARD</Text>
          <Text style={styles.greeting} numberOfLines={2}>
            {greeting}, {firstName}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
        <Pressable
          style={styles.bellBtn}
          accessibilityLabel="Notifications"
          onPress={onNotificationsPress}
        >
          <Bell size={18} color="#FFFFFF" strokeWidth={2} />
          {unreadCount > 0 ? (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarWrap}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <LinearGradient
              colors={["#C9A87C", "#4A6741"]}
              style={[styles.avatar, styles.avatarFallback]}
            >
              <Text style={styles.initials}>{initials}</Text>
            </LinearGradient>
          )}
          {isPremium ? (
            <View style={styles.crownBadge}>
              <Crown size={12} color="#FFFFFF" />
            </View>
          ) : null}
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, isPremium && styles.badgePremium]}>
              <Text style={[styles.badgeText, isPremium && styles.badgeTextPremium]}>
                {isPremium ? "Premium" : "Free plan"}
              </Text>
            </View>
            <Text style={styles.memberSince}>Since {memberSince}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 248,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.7)",
  },
  greeting: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.72)",
  },
  bellBtn: {
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C9A87C",
    borderWidth: 2,
    borderColor: "#FAF7F2",
  },
  bellBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  crownBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C9A87C",
    borderWidth: 2,
    borderColor: "#FAF7F2",
  },
  profileMeta: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  email: {
    marginTop: 2,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  badgePremium: {
    backgroundColor: "rgba(201,168,124,0.35)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.85)",
  },
  badgeTextPremium: {
    color: "#F5E6C8",
  },
  memberSince: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
  },
});
