import { type Href, useRouter } from "expo-router";
import { Compass, Crown, Heart, Tag } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface QuickActionsProps {
  savedCount: number;
  dealCount: number;
  isPremium: boolean;
  onUpgrade: () => void;
  onDealAlertsPress?: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  href?: Href;
  onPress?: () => void;
}

export function QuickActions({
  savedCount,
  dealCount,
  isPremium,
  onUpgrade,
  onDealAlertsPress,
}: QuickActionsProps) {
  const router = useRouter();

  const actions: ActionItem[] = [
    {
      id: "feed",
      label: "Discover",
      sublabel: "Browse feed",
      icon: Compass,
      color: "#4A6741",
      bg: "rgba(74,103,65,0.1)",
      href: "/(tabs)" as Href,
    },
    {
      id: "closet",
      label: "My closet",
      sublabel: `${savedCount} saved`,
      icon: Heart,
      color: "#C9A87C",
      bg: "rgba(201,168,124,0.15)",
      href: "/(tabs)/saved" as Href,
    },
    {
      id: "deals",
      label: "Deal alerts",
      sublabel: isPremium
        ? dealCount > 0
          ? `${dealCount} active`
          : "No drops yet"
        : "Premium perk",
      icon: Tag,
      color: "#A88758",
      bg: "rgba(201,168,124,0.12)",
      onPress: isPremium ? undefined : onDealAlertsPress ?? onUpgrade,
      href: isPremium ? ("/(tabs)/saved" as Href) : undefined,
    },
    {
      id: "premium",
      label: isPremium ? "Premium" : "Upgrade",
      sublabel: isPremium ? "All unlocked" : "Unlimited saves",
      icon: Crown,
      color: isPremium ? "#C9A87C" : "#4A6741",
      bg: isPremium ? "rgba(201,168,124,0.15)" : "rgba(74,103,65,0.1)",
      onPress: isPremium ? undefined : onUpgrade,
      href: isPremium ? ("/(billing)/subscription" as Href) : undefined,
    },
  ];

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Quick actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={styles.card}
            onPress={() => {
              if (action.onPress) {
                action.onPress();
                return;
              }
              if (action.href) {
                router.push(action.href);
              }
            }}
          >
            <View style={[styles.iconWrap, { backgroundColor: action.bg }]}>
              <action.icon size={18} color={action.color} strokeWidth={2.2} />
            </View>
            <Text style={styles.label}>{action.label}</Text>
            <Text style={styles.sublabel}>{action.sublabel}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48.5%",
    flexGrow: 1,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sublabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(26,26,26,0.45)",
  },
});
