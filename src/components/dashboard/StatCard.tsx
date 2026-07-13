import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: "sage" | "gold" | "neutral";
}

const ACCENT_STYLES = {
  sage: { bg: "rgba(74,103,65,0.1)", color: "#4A6741" },
  gold: { bg: "rgba(201,168,124,0.15)", color: "#A88758" },
  neutral: { bg: "#FFFFFF", color: "#1A1A1A" },
} as const;

export function StatCard({ icon: Icon, label, value, hint, accent = "neutral" }: StatCardProps) {
  const accentStyle = ACCENT_STYLES[accent];

  return (
    <View style={[styles.card, accent === "neutral" && styles.cardNeutral]}>
      <View style={[styles.iconWrap, { backgroundColor: accentStyle.bg }]}>
        <Icon size={16} color={accentStyle.color} strokeWidth={2.2} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function StatsGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.05)",
  },
  cardNeutral: {
    backgroundColor: "#FFFFFF",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: "#1A1A1A",
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(26,26,26,0.55)",
  },
  hint: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "500",
    color: "#4A6741",
  },
});
