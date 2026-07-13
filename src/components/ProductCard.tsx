import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { type Href, useRouter } from "expo-router";
import { Crown, Heart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { usePremium } from "@/src/contexts/AuthContext";
import type { Product } from "@/src/types/product";

interface ProductCardProps {
  product: Product;
  onSavePress: (id: string) => void;
  columnWidth: number;
}

export function ProductCard({ product, onSavePress, columnWidth }: ProductCardProps) {
  const router = useRouter();
  const { isPremium } = usePremium();
  const imageHeight = columnWidth * product.aspectRatio;
  const isLockedDrop = product.isPremiumDrop && !isPremium;

  const handleSave = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSavePress(product.id);
  };

  const handleOpen = () => {
    if (isLockedDrop) {
      onSavePress(product.id);
      return;
    }
    router.push(`/product/${product.id}` as Href);
  };

  return (
    <Pressable
      onPress={handleOpen}
      className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm"
      style={{ width: columnWidth }}
    >
      <View className="relative">
        <Image
          source={{ uri: product.sheinImageUrl }}
          style={{ width: columnWidth, height: imageHeight }}
          contentFit="cover"
          transition={300}
        />
        {product.isPremiumDrop ? (
          <View className="absolute left-2.5 top-2.5 flex-row items-center gap-1 rounded-full bg-gold px-2 py-1">
            <Crown size={10} color="#FFFFFF" />
            <Text className="text-[9px] font-bold uppercase tracking-wider text-white">
              Premium
            </Text>
          </View>
        ) : null}
        {isLockedDrop ? (
          <View
            className="absolute inset-0 items-center justify-center bg-charcoal/30"
            style={{ height: imageHeight }}
          >
            <Crown size={22} color="#FFFFFF" />
          </View>
        ) : null}
        <Pressable
          onPress={handleSave}
          hitSlop={12}
          className="absolute right-2.5 top-2.5 h-9 w-9 items-center justify-center rounded-full bg-white/90"
        >
          <Heart
            size={18}
            color={product.isSaved ? "#C9A87C" : "#1A1A1A"}
            fill={product.isSaved ? "#C9A87C" : "transparent"}
          />
        </Pressable>
        <View className="absolute bottom-2.5 left-2.5 rounded-full bg-charcoal/75 px-2.5 py-1">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-white">
            {product.category}
          </Text>
        </View>
      </View>
      <View className="p-3">
        <Text
          className="text-sm font-semibold leading-5 text-charcoal"
          numberOfLines={2}
        >
          {product.title}
        </Text>
        <Text className="mt-1 text-base font-bold text-sage">
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
