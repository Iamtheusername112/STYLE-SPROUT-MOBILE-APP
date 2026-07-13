import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import { ChevronRight, Heart } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import type { Product } from "@/src/types/product";

interface RecentSavesRowProps {
  products: Product[];
}

export function RecentSavesRow({ products }: RecentSavesRowProps) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Recently saved</Text>
        {products.length > 0 ? (
          <Pressable
            onPress={() => router.push("/(tabs)/saved" as Href)}
            style={styles.seeAll}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color="#4A6741" />
          </Pressable>
        ) : null}
      </View>

      {products.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Heart size={22} color="#4A6741" />
          </View>
          <Text style={styles.emptyTitle}>No saves yet</Text>
          <Text style={styles.emptyText}>
            Heart outfits on your feed to build your closet dashboard.
          </Text>
          <View style={styles.emptyBtn}>
            <AppButton
              label="Browse feed"
              showArrow={false}
              onPress={() => router.push("/(tabs)" as Href)}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {products.slice(0, 8).map((product) => (
            <Pressable
              key={product.id}
              onPress={() => router.push(`/product/${product.id}` as Href)}
              style={styles.card}
            >
              <Image
                source={{ uri: product.sheinImageUrl }}
                style={styles.image}
                contentFit="cover"
              />
              <View style={styles.cardBody}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
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
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A6741",
  },
  scroll: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 140,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  image: {
    width: 140,
    height: 168,
  },
  cardBody: {
    padding: 10,
  },
  category: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#4A6741",
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
  empty: {
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,103,65,0.1)",
    marginBottom: 12,
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
    textAlign: "center",
    color: "rgba(26,26,26,0.5)",
  },
  emptyBtn: {
    width: "100%",
    marginTop: 16,
  },
});
