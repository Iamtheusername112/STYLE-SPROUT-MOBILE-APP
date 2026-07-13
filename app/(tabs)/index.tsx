import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";

import { PremiumDropsSection } from "@/src/components/billing/PremiumDropsSection";
import { ErrorState } from "@/src/components/ErrorState";
import { LoadingState } from "@/src/components/LoadingState";
import { MasonryGrid } from "@/src/components/MasonryGrid";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { usePremium } from "@/src/contexts/AuthContext";
import { useSaveWithPremiumGate } from "@/src/hooks/useSaveWithPremiumGate";
import { useProductStore } from "@/src/store/useProductStore";

export default function FeedScreen() {
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { isPremium } = usePremium();
  const {
    handleSavePress,
    premiumModal,
    savedCount,
    savesRemaining,
    freeSaveLimit,
  } = useSaveWithPremiumGate();

  useEffect(() => {
    if (products.length === 0) {
      void fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const handleRefresh = useCallback(() => {
    void fetchProducts();
  }, [fetchProducts]);

  if (isLoading && products.length === 0) {
    return <LoadingState message="Curating today's outfits..." />;
  }

  if (error && products.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  return (
    <View className="flex-1 bg-cream">
      <ScreenHeader
        title="Discover"
        subtitle="Curated SHEIN looks, styled for you"
        rightElement={
          !isPremium ? (
            <View className="rounded-full bg-gold/15 px-3 py-1.5">
              <Text className="text-[11px] font-bold text-gold">
                {savedCount}/{freeSaveLimit} saves
              </Text>
            </View>
          ) : null
        }
      />

      <View className="px-4 pt-4">
        <PremiumDropsSection products={products} />
        {!isPremium && savesRemaining === 0 ? (
          <View className="mb-3 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3">
            <Text className="text-sm font-semibold text-charcoal">
              Save limit reached
            </Text>
            <Text className="mt-1 text-xs leading-5 text-charcoal/55">
              Upgrade to Premium for unlimited closet saves and exclusive drops.
            </Text>
          </View>
        ) : null}
      </View>

      <MasonryGrid products={products} onSavePress={handleSavePress} />
      {premiumModal}
    </View>
  );
}
