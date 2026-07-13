import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ShoppingBag } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import type { Product } from "@/src/types/product";
import { getProductDeal } from "@/src/utils/deals";

interface ShopNextCardProps {
  product: Product | null;
}

export function ShopNextCard({ product }: ShopNextCardProps) {
  const router = useRouter();

  if (!product) {
    return null;
  }

  const deal = getProductDeal(product);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: product.sheinImageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>SHOP NEXT</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.meta}>
            {product.category} · ${deal.salePrice.toFixed(2)}
            {deal.percentOff > 0 ? ` · ${deal.percentOff}% off` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.actionBtn}>
          <AppButton
            label="Shop on SHEIN"
            icon={ShoppingBag}
            size="sm"
            showArrow={false}
            onPress={() =>
              void WebBrowser.openBrowserAsync(product.affiliateUrl, {
                presentationStyle:
                  WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
              })
            }
          />
        </View>
        <View style={styles.actionBtn}>
          <AppButton
            label="View details"
            variant="secondary"
            size="sm"
            showArrow={false}
            onPress={() => router.push(`/product/${product.id}` as Href)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 88,
    height: 108,
    borderRadius: 14,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#4A6741",
  },
  title: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    color: "#1A1A1A",
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(26,26,26,0.5)",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
  },
});
