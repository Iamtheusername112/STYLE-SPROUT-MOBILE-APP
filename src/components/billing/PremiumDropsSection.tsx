import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import { Crown, Lock } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { usePremiumGate } from "@/src/hooks/usePremiumGate";
import type { Product } from "@/src/types/product";

interface PremiumDropsSectionProps {
  products: Product[];
}

export function PremiumDropsSection({ products }: PremiumDropsSectionProps) {
  const router = useRouter();
  const { isPremium, openPaywall, paywallModal } = usePremiumGate();
  const drops = products.filter((product) => product.isPremiumDrop);

  if (drops.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>PREMIUM EXCLUSIVE</Text>
          <Text style={styles.title}>Curated drops</Text>
        </View>
        {!isPremium ? (
          <View style={styles.lockPill}>
            <Lock size={12} color="#C9A87C" />
            <Text style={styles.lockText}>Premium</Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {drops.map((product) => (
          <Pressable
            key={product.id}
            style={styles.card}
            onPress={() => {
              if (!isPremium) {
                openPaywall("premium_drop", product);
                return;
              }
              router.push(`/product/${product.id}` as Href);
            }}
          >
            <Image
              source={{ uri: product.sheinImageUrl }}
              style={styles.image}
              contentFit="cover"
            />
            {!isPremium ? (
              <View style={styles.lockOverlay}>
                <Crown size={18} color="#FFFFFF" />
              </View>
            ) : null}
            <View style={styles.body}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.productTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {!isPremium ? (
        <View style={styles.cta}>
          <AppButton
            label="Unlock exclusive drops"
            icon={Crown}
            variant="gold"
            size="sm"
            showArrow={false}
            onPress={() => openPaywall("premium_drop")}
          />
        </View>
      ) : null}

      {paywallModal}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#C9A87C",
  },
  title: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  lockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(201,168,124,0.15)",
  },
  lockText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#A88758",
  },
  scroll: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 156,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(201,168,124,0.2)",
  },
  image: {
    width: 156,
    height: 188,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(26,26,26,0.35)",
    height: 188,
  },
  body: {
    padding: 10,
  },
  category: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#C9A87C",
  },
  productTitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    color: "#1A1A1A",
  },
  price: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#4A6741",
  },
  cta: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
});
