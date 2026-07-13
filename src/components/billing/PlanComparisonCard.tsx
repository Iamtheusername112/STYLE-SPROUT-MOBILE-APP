import { Check, Crown, Minus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { PLAN_COPY, PREMIUM_FEATURES } from "@/src/constants/premium";

interface PlanComparisonCardProps {
  variant: "free" | "premium";
  isCurrentPlan: boolean;
  onSelect?: () => void;
  loading?: boolean;
}

export function PlanComparisonCard({
  variant,
  isCurrentPlan,
  onSelect,
  loading,
}: PlanComparisonCardProps) {
  const isPremium = variant === "premium";
  const freeCopy = PLAN_COPY.free;
  const premiumCopy = PLAN_COPY.premium;

  return (
    <View style={[styles.card, isPremium && styles.cardPremium]}>
      {isPremium ? (
        <View style={styles.recommended}>
          <Crown size={12} color="#FFFFFF" />
          <Text style={styles.recommendedText}>Most popular</Text>
        </View>
      ) : null}

      <Text style={styles.planName}>
        {isPremium ? premiumCopy.name : freeCopy.name}
      </Text>
      <Text style={styles.tagline}>
        {isPremium ? premiumCopy.tagline : freeCopy.tagline}
      </Text>

      <View style={styles.priceRow}>
        <Text style={[styles.price, isPremium && styles.pricePremium]}>
          {isPremium ? premiumCopy.monthlyPrice : freeCopy.price}
        </Text>
        <Text style={styles.period}>
          /{isPremium ? "month" : freeCopy.period}
        </Text>
      </View>

      {isPremium ? (
        <Text style={styles.trial}>{premiumCopy.trial} · Cancel anytime</Text>
      ) : null}

      <View style={styles.features}>
        {PREMIUM_FEATURES.map((feature) => {
          const included = isPremium || feature.id === "unlimited_saves";
          const label = isPremium ? feature.premiumLabel : feature.freeLabel;
          const limited =
            !isPremium &&
            (feature.id === "deal_alerts" ||
              feature.id === "premium_drops" ||
              feature.id === "closet_insights");

          return (
            <View key={feature.id} style={styles.featureRow}>
              <View
                style={[
                  styles.featureIcon,
                  included && !limited && styles.featureIconOn,
                  limited && styles.featureIconLimited,
                ]}
              >
                {limited ? (
                  <Minus size={12} color="#A88758" />
                ) : (
                  <Check size={12} color={included ? "#4A6741" : "#B0B0B0"} />
                )}
              </View>
              <View style={styles.featureCopy}>
                <Text style={styles.featureLabel}>{feature.label}</Text>
                <Text style={styles.featureValue}>{label}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {isCurrentPlan ? (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>Current plan</Text>
        </View>
      ) : isPremium ? (
        <AppButton
          label="Start free trial"
          icon={Crown}
          variant="gold"
          showArrow={false}
          loading={loading}
          onPress={() => onSelect?.()}
        />
      ) : (
        <Pressable style={styles.freeBtn} disabled>
          <Text style={styles.freeBtnText}>Included with your account</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.08)",
    marginBottom: 16,
  },
  cardPremium: {
    borderColor: "rgba(201,168,124,0.45)",
    backgroundColor: "#FFFDF9",
  },
  recommended: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#C9A87C",
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  planName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  tagline: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(26,26,26,0.55)",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 14,
    gap: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  pricePremium: {
    color: "#4A6741",
  },
  period: {
    marginBottom: 5,
    fontSize: 14,
    color: "rgba(26,26,26,0.45)",
  },
  trial: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#A88758",
  },
  features: {
    marginTop: 18,
    marginBottom: 18,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  featureIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
  },
  featureIconOn: {
    backgroundColor: "rgba(74,103,65,0.12)",
  },
  featureIconLimited: {
    backgroundColor: "rgba(201,168,124,0.12)",
  },
  featureCopy: {
    flex: 1,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  featureValue: {
    marginTop: 1,
    fontSize: 12,
    color: "rgba(26,26,26,0.5)",
  },
  currentBadge: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(74,103,65,0.08)",
  },
  currentBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A6741",
  },
  freeBtn: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#FAF7F2",
  },
  freeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(26,26,26,0.45)",
  },
});
