import { useMemo, useState } from "react";

import {
  PremiumModal,
  type PremiumModalProps,
} from "@/src/components/PremiumModal";
import { usePremium } from "@/src/contexts/AuthContext";
import { FREE_SAVE_LIMIT } from "@/src/constants/premium";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";
import { useProductStore } from "@/src/store/useProductStore";
import type { Product } from "@/src/types/product";

export type PaywallReason =
  | "save_limit"
  | "premium_drop"
  | "deal_alerts"
  | "closet_insights"
  | "generic";

const PAYWALL_COPY: Record<
  PaywallReason,
  { title?: string; subtitle: string }
> = {
  save_limit: {
    subtitle: `You've saved ${FREE_SAVE_LIMIT} looks on the free plan. Upgrade for unlimited closet saves.`,
  },
  premium_drop: {
    subtitle: "This outfit is part of our exclusive Premium drop. Subscribe to save and shop it.",
  },
  deal_alerts: {
    subtitle: "Deal alerts are a Premium perk. Get notified when saved looks drop in price.",
  },
  closet_insights: {
    subtitle: "Unlock full closet insights, deal tracking, and style breakdown with Premium.",
  },
  generic: {
    subtitle: "Upgrade to Sprout Premium for unlimited saves, exclusive drops, and deal alerts.",
  },
};

export function usePremiumGate() {
  const { isPremium, freeSaveLimit } = usePremium();
  const { openPlans } = usePremiumCheckout();
  const products = useProductStore((state) => state.products);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<PaywallReason>("generic");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const savedCount = useMemo(
    () => products.filter((product) => product.isSaved).length,
    [products],
  );

  const savesRemaining = Math.max(freeSaveLimit - savedCount, 0);

  const canSaveMore = isPremium || savedCount < freeSaveLimit;
  const canAccessDealAlerts = isPremium;
  const canAccessPremiumDrops = isPremium;
  const canAccessFullInsights = isPremium;

  const openPaywall = (reason: PaywallReason, product?: Product | null) => {
    setPaywallReason(reason);
    setPendingProduct(product ?? null);
    setShowPaywall(true);
  };

  const closePaywall = () => {
    setShowPaywall(false);
    setPendingProduct(null);
  };

  const canSaveProduct = (product: Product): boolean => {
    if (product.isSaved) return true;
    if (product.isPremiumDrop && !isPremium) return false;
    if (isPremium) return true;
    return savedCount < freeSaveLimit;
  };

  const getSaveBlockReason = (product: Product): PaywallReason | null => {
    if (product.isSaved) return null;
    if (product.isPremiumDrop && !isPremium) return "premium_drop";
    if (!isPremium && savedCount >= freeSaveLimit) return "save_limit";
    return null;
  };

  const paywallCopy = PAYWALL_COPY[paywallReason];

  const modalProps: PremiumModalProps = {
    visible: showPaywall,
    onClose: closePaywall,
    onUpgrade: () => {
      closePaywall();
      openPlans();
    },
    productImage: pendingProduct?.sheinImageUrl,
    productTitle: pendingProduct?.title ?? paywallCopy.title,
    subtitle: paywallCopy.subtitle,
    savesRemaining: !isPremium ? savesRemaining : undefined,
    freeSaveLimit,
  };

  const paywallModal = <PremiumModal {...modalProps} />;

  return {
    isPremium,
    savedCount,
    savesRemaining,
    freeSaveLimit,
    canSaveMore,
    canAccessDealAlerts,
    canAccessPremiumDrops,
    canAccessFullInsights,
    canSaveProduct,
    getSaveBlockReason,
    openPaywall,
    closePaywall,
    paywallModal,
  };
}
