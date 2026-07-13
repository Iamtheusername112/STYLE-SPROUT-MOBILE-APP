import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ArrowLeft,
  Crown,
  ExternalLink,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/src/components/ErrorState";
import { LoadingState } from "@/src/components/LoadingState";
import { AppButton } from "@/src/components/ui/AppButton";
import { usePremium } from "@/src/contexts/AuthContext";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";
import { useSaveWithPremiumGate } from "@/src/hooks/useSaveWithPremiumGate";
import { useProductStore } from "@/src/store/useProductStore";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremium();
  const { openPlans } = usePremiumCheckout();
  const { handleSavePress, premiumModal } = useSaveWithPremiumGate();

  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const getProductById = useProductStore((state) => state.getProductById);

  const product = id ? getProductById(id) : undefined;
  const isLockedDrop = product?.isPremiumDrop && !isPremium;

  useEffect(() => {
    if (products.length === 0) {
      void fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const handleSave = () => {
    if (!product) return;
    handleSavePress(product.id);
  };

  const handleShopOnShein = async () => {
    if (!product) return;

    await WebBrowser.openBrowserAsync(product.affiliateUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: "#4A6741",
      toolbarColor: "#FAF7F2",
    });
  };

  if (isLoading && !product) {
    return <LoadingState message="Loading outfit details..." />;
  }

  if ((error && !product) || !product) {
    return (
      <ErrorState
        message={error ?? "This outfit could not be found."}
        onRetry={() => {
          void fetchProducts();
          router.back();
        }}
      />
    );
  }

  if (isLockedDrop) {
    return (
      <View className="flex-1 bg-cream">
        <View className="relative">
          <Image
            source={{ uri: product.sheinImageUrl }}
            style={{ width: "100%", height: 420 }}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={["transparent", "#FAF7F2"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          <View
            className="absolute left-0 right-0 flex-row items-center justify-between px-4"
            style={{ top: insets.top + 8 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/90"
            >
              <ArrowLeft size={22} color="#1A1A1A" />
            </Pressable>
          </View>
        </View>

        <View className="flex-1 px-5 pb-10" style={{ marginTop: -24 }}>
          <View className="items-center rounded-3xl border border-gold/25 bg-white px-6 py-8">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-gold/15">
              <Crown size={26} color="#C9A87C" />
            </View>
            <Text className="text-[11px] font-bold uppercase tracking-[2px] text-gold">
              Premium exclusive
            </Text>
            <Text className="mt-2 text-center text-2xl font-bold text-charcoal">
              {product.title}
            </Text>
            <Text className="mt-3 text-center text-sm leading-6 text-charcoal/55">
              This curated drop is reserved for Sprout Premium members. Subscribe
              to view details, save, and shop this look.
            </Text>
            <View className="mt-6 w-full">
              <AppButton
                label="View plans & unlock"
                icon={Crown}
                variant="gold"
                size="lg"
                showArrow={false}
                onPress={() => openPlans()}
              />
            </View>
          </View>
        </View>
        {premiumModal}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream">
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View className="relative">
          <Image
            source={{ uri: product.sheinImageUrl }}
            style={{ width: "100%", height: 480 }}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={["transparent", "#FAF7F2"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />

          <View
            className="absolute left-0 right-0 flex-row items-center justify-between px-4"
            style={{ top: insets.top + 8 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/90"
            >
              <ArrowLeft size={22} color="#1A1A1A" />
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable
                onPress={handleSave}
                className="h-11 w-11 items-center justify-center rounded-full bg-white/90"
              >
                <Heart
                  size={20}
                  color={product.isSaved ? "#C9A87C" : "#1A1A1A"}
                  fill={product.isSaved ? "#C9A87C" : "transparent"}
                />
              </Pressable>
              <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-white/90">
                <Share2 size={20} color="#1A1A1A" />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-5 pb-10" style={{ marginTop: -24 }}>
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-sage/10 px-3 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-sage">
                {product.category}
              </Text>
            </View>
            {product.isPremiumDrop ? (
              <View className="flex-row items-center rounded-full bg-gold/15 px-3 py-1">
                <Crown size={10} color="#C9A87C" />
                <Text className="ml-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                  Premium drop
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center rounded-full bg-gold/15 px-3 py-1">
                <Sparkles size={10} color="#C9A87C" />
                <Text className="ml-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                  Curated
                </Text>
              </View>
            )}
          </View>

          <Text className="mt-4 text-3xl font-bold leading-tight tracking-tight text-charcoal">
            {product.title}
          </Text>

          <View className="mt-4 flex-row items-end gap-2">
            <Text className="text-4xl font-bold text-sage">
              ${product.price.toFixed(2)}
            </Text>
            <Text className="mb-1 text-sm text-charcoal/40">on SHEIN</Text>
          </View>

          <Text className="mt-6 text-base leading-7 text-charcoal/70">
            {product.description}
          </Text>

          <View className="mt-8">
            <AppButton
              label="Shop on SHEIN"
              icon={ExternalLink}
              size="lg"
              onPress={() => void handleShopOnShein()}
            />
          </View>

          <Text className="mt-4 text-center text-xs text-charcoal/30">
            Opens in a secure in-app browser · Affiliate link
          </Text>
        </View>
      </ScrollView>

      {premiumModal}
    </View>
  );
}
