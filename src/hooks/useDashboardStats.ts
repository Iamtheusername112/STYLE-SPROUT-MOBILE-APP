import { useMemo } from "react";

import { CLOSET_GOAL } from "@/src/constants/dashboard";
import type { Product } from "@/src/types/product";
import { getDealAlerts, type ProductDeal } from "@/src/utils/deals";

export interface DashboardStats {
  savedCount: number;
  closetValue: number;
  estimatedSavings: number;
  categoriesExplored: number;
  savedProducts: Product[];
  categoryBreakdown: { category: string; count: number }[];
  topCategory: string | null;
  avgOutfitPrice: number;
  closetGoal: number;
  goalProgress: number;
  goalRemaining: number;
  goalComplete: boolean;
  dealAlerts: ProductDeal[];
  shopNext: Product | null;
}

export function useDashboardStats(products: Product[]): DashboardStats {
  return useMemo(() => {
    const savedProducts = [...products.filter((product) => product.isSaved)].sort(
      (a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0),
    );
    const savedCount = savedProducts.length;
    const closetValue = savedProducts.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    const estimatedSavings = closetValue * 0.18;
    const avgOutfitPrice = savedCount > 0 ? closetValue / savedCount : 0;
    const categoryMap = new Map<string, number>();

    savedProducts.forEach((product) => {
      categoryMap.set(
        product.category,
        (categoryMap.get(product.category) ?? 0) + 1,
      );
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const allCategories = new Set(products.map((product) => product.category));
    const dealAlerts = getDealAlerts(products);
    const goalProgress = Math.min(savedCount / CLOSET_GOAL, 1);
    const goalRemaining = Math.max(CLOSET_GOAL - savedCount, 0);

    return {
      savedCount,
      closetValue,
      estimatedSavings,
      categoriesExplored: allCategories.size,
      savedProducts,
      categoryBreakdown,
      topCategory: categoryBreakdown[0]?.category ?? null,
      avgOutfitPrice,
      closetGoal: CLOSET_GOAL,
      goalProgress,
      goalRemaining,
      goalComplete: savedCount >= CLOSET_GOAL,
      dealAlerts,
      shopNext: savedProducts[0] ?? null,
    };
  }, [products]);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getDashboardSubtitle(stats: DashboardStats): string {
  if (stats.goalComplete) {
    return "Your starter closet is complete — time to shop your saves.";
  }

  if (stats.savedCount === 0) {
    return "Save outfits from your feed to start building your closet.";
  }

  if (stats.dealAlerts.length > 0) {
    return `${stats.dealAlerts.length} saved ${stats.dealAlerts.length === 1 ? "look has" : "looks have"} a price drop today.`;
  }

  return `${stats.goalRemaining} more saves until your ${stats.closetGoal}-look closet goal.`;
}
