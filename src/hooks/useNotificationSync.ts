import { useEffect, useRef } from "react";

import { CLOSET_GOAL } from "@/src/constants/dashboard";
import { usePremium } from "@/src/contexts/AuthContext";
import {
  presentLocalNotification,
  scheduleDealReminder,
} from "@/src/services/notificationService";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { useProductStore } from "@/src/store/useProductStore";
import { getDealAlerts } from "@/src/utils/deals";

export function useNotificationSync() {
  const { isPremium } = usePremium();
  const products = useProductStore((state) => state.products);
  const preferences = useNotificationStore((state) => state.preferences);
  const preferencesLoaded = useNotificationStore((state) => state.preferencesLoaded);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const showBanner = useNotificationStore((state) => state.showBanner);

  const previousSavedIds = useRef<Set<string>>(new Set());
  const previousDealIds = useRef<Set<string>>(new Set());
  const announcedDropIds = useRef<Set<string>>(new Set());
  const announcedGoal = useRef(false);
  const seededWelcome = useRef(false);

  useEffect(() => {
    if (!preferencesLoaded || products.length === 0) return;

    const savedProducts = products.filter((product) => product.isSaved);
    const savedIds = new Set(savedProducts.map((product) => product.id));
    const dealAlerts = getDealAlerts(products);
    const dealIds = new Set(dealAlerts.map((deal) => deal.product.id));

    if (!seededWelcome.current) {
      seededWelcome.current = true;
      addNotification({
        kind: "feed_update",
        title: "Fresh looks on your feed",
        body: "New curated SHEIN outfits are ready to explore today.",
        dedupeKey: "welcome-feed",
      });
    }

    savedProducts.forEach((product) => {
      if (previousSavedIds.current.has(product.id)) return;

      const notification = addNotification({
        kind: "save",
        title: "Added to your closet",
        body: product.title,
        productId: product.id,
        href: `/product/${product.id}`,
        dedupeKey: `save-${product.id}`,
      });

      if (notification) {
        showBanner(notification);
      }
    });

    if (
      isPremium &&
      preferences.dealAlerts &&
      preferences.pushEnabled
    ) {
      dealAlerts.forEach((deal) => {
        if (previousDealIds.current.has(deal.product.id)) return;

        const notification = addNotification({
          kind: "deal_alert",
          title: `${deal.percentOff}% off a saved look`,
          body: `"${deal.product.title}" dropped to $${deal.salePrice.toFixed(2)}`,
          productId: deal.product.id,
          href: `/product/${deal.product.id}`,
          dedupeKey: `deal-${deal.product.id}`,
        });

        if (notification) {
          showBanner(notification);
          void presentLocalNotification(notification);
          void scheduleDealReminder(notification, 120);
        }
      });
    }

    const premiumDrops = products.filter((product) => product.isPremiumDrop);
    premiumDrops.forEach((product) => {
      if (announcedDropIds.current.has(product.id)) return;
      announcedDropIds.current.add(product.id);

      if (!isPremium) return;

      const notification = addNotification({
        kind: "premium_drop",
        title: "New premium drop",
        body: `${product.title} is live in exclusive drops.`,
        productId: product.id,
        href: `/product/${product.id}`,
        dedupeKey: `drop-${product.id}`,
      });

      if (notification && preferences.premiumDrops && preferences.pushEnabled) {
        void presentLocalNotification(notification);
      }
    });

    if (
      savedProducts.length >= CLOSET_GOAL &&
      !announcedGoal.current &&
      preferences.closetGoals
    ) {
      announcedGoal.current = true;
      const notification = addNotification({
        kind: "closet_goal",
        title: "Closet goal complete",
        body: `You've saved ${CLOSET_GOAL} looks. Time to shop your starter wardrobe.`,
        href: "/(tabs)/saved",
        dedupeKey: "closet-goal-complete",
      });

      if (notification) {
        showBanner(notification);
        if (preferences.pushEnabled) {
          void presentLocalNotification(notification);
        }
      }
    }

    if (!isPremium && savedProducts.length >= 3) {
      addNotification({
        kind: "premium_upsell",
        title: "Save limit reached",
        body: "Upgrade to Premium for unlimited closet saves and deal alerts.",
        href: "/(billing)/plans",
        dedupeKey: "premium-upsell-limit",
      });
    }

    previousSavedIds.current = savedIds;
    previousDealIds.current = dealIds;
  }, [
    addNotification,
    isPremium,
    preferences.closetGoals,
    preferences.dealAlerts,
    preferences.premiumDrops,
    preferences.pushEnabled,
    preferencesLoaded,
    products,
    showBanner,
  ]);
}
