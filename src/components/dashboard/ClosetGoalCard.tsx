import { Target } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface ClosetGoalCardProps {
  savedCount: number;
  closetGoal: number;
  goalProgress: number;
  goalRemaining: number;
  goalComplete: boolean;
  topCategory: string | null;
}

export function ClosetGoalCard({
  savedCount,
  closetGoal,
  goalProgress,
  goalRemaining,
  goalComplete,
  topCategory,
}: ClosetGoalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Target size={18} color="#4A6741" strokeWidth={2.2} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>
            {goalComplete ? "Closet goal complete" : "Build your starter closet"}
          </Text>
          <Text style={styles.subtitle}>
            {goalComplete
              ? `You've saved ${savedCount} looks. Shop your favorites or keep curating.`
              : `Save ${goalRemaining} more ${goalRemaining === 1 ? "look" : "looks"} to hit your ${closetGoal}-piece goal.`}
          </Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${goalProgress * 100}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          {savedCount} / {closetGoal} looks saved
        </Text>
        {topCategory ? (
          <Text style={styles.vibeText}>Vibe: {topCategory}</Text>
        ) : null}
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,103,65,0.1)",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(26,26,26,0.5)",
  },
  track: {
    marginTop: 14,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FAF7F2",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#4A6741",
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A6741",
  },
  vibeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(26,26,26,0.45)",
  },
});
