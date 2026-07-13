import { type Href, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Compass, Heart, ShoppingBag } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from "@/src/components/ui/AppButton";
import { useSaveWithPremiumGate } from "@/src/hooks/useSaveWithPremiumGate";
import { useProductStore } from "@/src/store/useProductStore";

export default function SavedScreen() {
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { handleSavePress, premiumModal } = useSaveWithPremiumGate();

  const savedProducts = useMemo(
    () => products.filter((product) => product.isSaved),
    [products],
  );

  useEffect(() => {
    if (products.length === 0) {
      void fetchProducts();
    }
  }, [fetchProducts, products.length]);

  return (
    <View className="flex-1 bg-cream">
      <ScreenHeader
        title="Saved"
        subtitle={
          savedProducts.length > 0
            ? `${savedProducts.length} outfit${savedProducts.length === 1 ? "" : "s"} in your closet`
            : "Your favorite looks live here"
        }
      />

      {savedProducts.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-sage/10">
            <Heart size={36} color="#4A6741" />
          </View>
          <Text className="mb-2 text-center text-xl font-bold text-charcoal">
            No saved outfits yet
          </Text>
          <Text className="mb-8 text-center text-sm leading-5 text-charcoal/50">
            Tap the heart on any look in your feed to build your personal style
            collection.
          </Text>
          <View className="w-full max-w-xs">
            <AppButton
              label="Explore Feed"
              icon={Compass}
              onPress={() => router.push("/(tabs)" as Href)}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-8 pt-2"
        >
          {savedProducts.map((product) => (
            <Pressable
              key={product.id}
              onPress={() => router.push(`/product/${product.id}` as Href)}
              className="mb-3 flex-row overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <Image
                source={{ uri: product.sheinImageUrl }}
                style={{ width: 110, height: 130 }}
                contentFit="cover"
              />
              <View className="flex-1 justify-between p-4">
                <View>
                  <Text className="text-[10px] font-semibold uppercase tracking-wider text-sage">
                    {product.category}
                  </Text>
                  <Text
                    className="mt-1 text-base font-semibold text-charcoal"
                    numberOfLines={2}
                  >
                    {product.title}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-sage">
                    ${product.price.toFixed(2)}
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        handleSavePress(product.id);
                      }}
                      className="h-9 w-9 items-center justify-center rounded-full bg-cream"
                    >
                      <Heart size={16} color="#C9A87C" fill="#C9A87C" />
                    </Pressable>
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-sage/10">
                      <ShoppingBag size={16} color="#4A6741" />
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
      {premiumModal}
    </View>
  );
}
