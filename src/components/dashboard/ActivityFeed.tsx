import type { LucideIcon } from "lucide-react-native";
import { Clock, Heart, Sparkles, Tag } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import type { Product } from "@/src/types/product";

interface ActivityFeedProps {
  savedProducts: Product[];
  isPremium: boolean;
  categoriesExplored: number;
}

export function ActivityFeed({
  savedProducts,
  isPremium,
  categoriesExplored,
}: ActivityFeedProps) {
  const activities = buildActivities(savedProducts, isPremium, categoriesExplored);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent activity</Text>
      <View style={styles.list}>
        {activities.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <item.icon size={14} color={item.color} strokeWidth={2.2} />
            </View>
            <View style={styles.content}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityMeta}>{item.meta}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildActivities(
  savedProducts: Product[],
  isPremium: boolean,
  categoriesExplored: number,
): {
  id: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  title: string;
  meta: string;
}[] {
  const items: {
    id: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    title: string;
    meta: string;
  }[] = [];

  if (savedProducts[0]) {
    items.push({
      id: "save-latest",
      icon: Heart,
      color: "#C9A87C",
      bg: "rgba(201,168,124,0.15)",
      title: `Saved "${savedProducts[0].title}"`,
      meta: "Added to your closet",
    });
  }

  items.push({
    id: "explore",
    icon: Sparkles,
    color: "#4A6741",
    bg: "rgba(74,103,65,0.1)",
    title: `Explored ${categoriesExplored} style categories`,
    meta: "Across your feed",
  });

  if (!isPremium) {
    items.push({
      id: "premium",
      icon: Tag,
      color: "#A88758",
      bg: "rgba(201,168,124,0.12)",
      title: "Premium deals available",
      meta: "Unlock unlimited saves",
    });
  }

  items.push({
    id: "sync",
    icon: Clock,
    color: "#4A6741",
    bg: "rgba(74,103,65,0.1)",
    title: "Closet synced",
    meta: "Just now",
  });

  return items.slice(0, 4);
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  list: {
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
  },
  activityMeta: {
    marginTop: 2,
    fontSize: 11,
    color: "rgba(26,26,26,0.45)",
  },
});
