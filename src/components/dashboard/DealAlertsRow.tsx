import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight, Crown, Tag } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PremiumLockedCard } from "@/src/components/billing/PremiumLockedOverlay";
import type { ProductDeal } from "@/src/utils/deals";

interface DealAlertsRowProps {
  deals: ProductDeal[];
  isPremium: boolean;
  onUpgrade: () => void;
}

export function DealAlertsRow({ deals, isPremium, onUpgrade }: DealAlertsRowProps) {
  const router = useRouter();

  if (!isPremium) {
    return (
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.title}>Deal alerts</Text>
          <View style={styles.premiumPill}>
            <Crown size={10} color="#C9A87C" />
            <Text style={styles.premiumPillText}>Premium</Text>
          </View>
        </View>
        <PremiumLockedCard
          title="Deal alerts are Premium"
          description="Get notified when saved looks drop in price. Upgrade to unlock real-time deal tracking."
          onUpgrade={onUpgrade}
          onPress={onUpgrade}
        />
      </View>
    );
  }

  if (deals.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Tag size={18} color="#A88758" />
        </View>
        <Text style={styles.emptyTitle}>No deal alerts yet</Text>
        <Text style={styles.emptyText}>
          Save outfits to your closet and we&apos;ll surface price drops here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Deal alerts</Text>
        <Text style={styles.badge}>{deals.length} active</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {deals.slice(0, 6).map((deal) => (
          <Pressable
            key={deal.product.id}
            style={styles.card}
            onPress={() =>
              router.push(`/product/${deal.product.id}` as Href)
            }
          >
            <Image
              source={{ uri: deal.product.sheinImageUrl }}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>-{deal.percentOff}%</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {deal.product.title}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.salePrice}>${deal.salePrice.toFixed(2)}</Text>
                <Text style={styles.oldPrice}>
                  ${deal.product.price.toFixed(2)}
                </Text>
              </View>
              <Pressable
                style={styles.shopLink}
                onPress={() =>
                  void WebBrowser.openBrowserAsync(deal.product.affiliateUrl, {
                    presentationStyle:
                      WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
                  })
                }
              >
                <Text style={styles.shopLinkText}>Shop on SHEIN</Text>
                <ChevronRight size={12} color="#4A6741" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A88758",
    backgroundColor: "rgba(201,168,124,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  premiumPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(201,168,124,0.15)",
  },
  premiumPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#A88758",
  },
  scroll: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 168,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  image: {
    width: 168,
    height: 148,
  },
  badgePill: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#C9A87C",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  body: {
    padding: 12,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    color: "#1A1A1A",
    minHeight: 32,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  salePrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4A6741",
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(26,26,26,0.35)",
    textDecorationLine: "line-through",
  },
  shopLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 2,
  },
  shopLinkText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4A6741",
  },
  emptyCard: {
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,124,0.12)",
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "rgba(26,26,26,0.5)",
  },
});
