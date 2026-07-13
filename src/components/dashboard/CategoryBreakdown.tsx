import { StyleSheet, Text, View } from "react-native";

interface CategoryBreakdownProps {
  breakdown: { category: string; count: number }[];
  totalSaved: number;
}

export function CategoryBreakdown({ breakdown, totalSaved }: CategoryBreakdownProps) {
  if (totalSaved === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Style breakdown</Text>
        <Text style={styles.emptyText}>
          Save outfits to see which categories dominate your closet.
        </Text>
      </View>
    );
  }

  const maxCount = breakdown[0]?.count ?? 1;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Style breakdown</Text>
      <Text style={styles.subtitle}>Categories in your saved closet</Text>

      <View style={styles.list}>
        {breakdown.map((item) => {
          const widthPercent = Math.max((item.count / maxCount) * 100, 12);

          return (
            <View key={item.category} style={styles.row}>
              <View style={styles.rowTop}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.count}>
                  {item.count} {item.count === 1 ? "look" : "looks"}
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${widthPercent}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  emptyCard: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(26,26,26,0.45)",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(26,26,26,0.5)",
  },
  list: {
    marginTop: 14,
    gap: 12,
  },
  row: {
    gap: 6,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  count: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(26,26,26,0.45)",
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FAF7F2",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#4A6741",
  },
});
