import { Crown, Heart, Sparkles, Tag } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const PERKS = [
  { icon: Heart, label: "Unlimited saves" },
  { icon: Tag, label: "Deal alerts first" },
  { icon: Sparkles, label: "Exclusive drops" },
] as const;

export function PremiumPerksCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Crown size={18} color="#C9A87C" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>SPROUT PREMIUM</Text>
          <Text style={styles.title}>Your membership is active</Text>
          <Text style={styles.subtitle}>
            You have full access to saves, deal alerts, and curated drops.
          </Text>
        </View>
      </View>

      <View style={styles.perks}>
        {PERKS.map((perk) => (
          <View key={perk.label} style={styles.perk}>
            <perk.icon size={14} color="#4A6741" strokeWidth={2.2} />
            <Text style={styles.perkText}>{perk.label}</Text>
          </View>
        ))}
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
    borderColor: "rgba(201,168,124,0.25)",
  },
  header: {
    flexDirection: "row",
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,124,0.15)",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#C9A87C",
  },
  title: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(26,26,26,0.5)",
  },
  perks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  perk: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(74,103,65,0.08)",
  },
  perkText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A6741",
  },
});
