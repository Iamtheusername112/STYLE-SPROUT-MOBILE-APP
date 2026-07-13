import type { Href } from "expo-router";

type RouterLike = {
  replace: (href: Href) => void;
  dismiss?: (count?: number) => void;
  canDismiss?: () => boolean;
};

const DASHBOARD_ROUTE = "/(tabs)/profile";

export function navigateToDashboard(
  router: RouterLike,
  decorateUrl?: (url: string) => string,
) {
  const destination = (decorateUrl
    ? decorateUrl(DASHBOARD_ROUTE)
    : DASHBOARD_ROUTE) as Href;

  if (router.canDismiss?.()) {
    router.dismiss?.();
  }

  router.replace(destination);
}
