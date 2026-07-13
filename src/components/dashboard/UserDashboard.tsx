import { useAuth, useUser } from "@clerk/expo";
import {
  Compass,
  DollarSign,
  Grid3x3,
  Heart,
  LogOut,
  Mail,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PremiumLockedCard } from "@/src/components/billing/PremiumLockedOverlay";
import { ActivityFeed } from "@/src/components/dashboard/ActivityFeed";
import { CategoryBreakdown } from "@/src/components/dashboard/CategoryBreakdown";
import { ClosetGoalCard } from "@/src/components/dashboard/ClosetGoalCard";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { DealAlertsRow } from "@/src/components/dashboard/DealAlertsRow";
import { NotificationsSheet } from "@/src/components/dashboard/NotificationsSheet";
import { PremiumPerksCard } from "@/src/components/dashboard/PremiumPerksCard";
import { QuickActions } from "@/src/components/dashboard/QuickActions";
import { RecentSavesRow } from "@/src/components/dashboard/RecentSavesRow";
import { ShopNextCard } from "@/src/components/dashboard/ShopNextCard";
import { StatCard, StatsGrid } from "@/src/components/dashboard/StatCard";
import { NotificationPreferencesCard } from "@/src/components/notifications/NotificationPreferencesCard";
import { PremiumBanner } from "@/src/components/profile/ProfileUi";
import { PROFILE_IMAGES } from "@/src/components/profile/ProfileBackdrop";
import { ProfileMenuRow, GlassCard } from "@/src/components/profile/ProfileUi";
import { AppButton } from "@/src/components/ui/AppButton";
import { usePremium } from "@/src/contexts/AuthContext";
import { useNotifications } from "@/src/contexts/NotificationContext";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";
import { usePremiumGate } from "@/src/hooks/usePremiumGate";
import {
  getDashboardSubtitle,
  getGreeting,
  useDashboardStats,
} from "@/src/hooks/useDashboardStats";
import { useProductStore } from "@/src/store/useProductStore";

export function UserDashboard() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { isPremium, freeSaveLimit } = usePremium();
  const { openPlans, openSubscription } = usePremiumCheckout();
  const { openPaywall, paywallModal, savedCount: gateSavedCount } = usePremiumGate();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const stats = useDashboardStats(products);

  useEffect(() => {
    if (products.length === 0) {
      void fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress ??
    "Sprout Member";
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const initials = displayName.charAt(0).toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "2025";

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <DashboardHeader
          greeting={getGreeting()}
          subtitle={getDashboardSubtitle(stats)}
          displayName={displayName}
          email={email}
          initials={initials}
          imageUrl={user?.imageUrl}
          isPremium={isPremium}
          memberSince={memberSince}
          unreadCount={unreadCount}
          onNotificationsPress={() => setShowNotifications(true)}
        />

        <View style={styles.body}>
          <QuickActions
            savedCount={stats.savedCount}
            dealCount={stats.dealAlerts.length}
            isPremium={isPremium}
            onUpgrade={() => openPlans()}
            onDealAlertsPress={() => openPaywall("deal_alerts")}
          />

          <View style={styles.section}>
            <ClosetGoalCard
              savedCount={stats.savedCount}
              closetGoal={stats.closetGoal}
              goalProgress={stats.goalProgress}
              goalRemaining={stats.goalRemaining}
              goalComplete={stats.goalComplete}
              topCategory={stats.topCategory}
            />
          </View>

          <View style={styles.section}>
            <StatsGrid>
              <StatCard
                icon={Heart}
                label="Saved looks"
                value={String(stats.savedCount)}
                hint={
                  isPremium
                    ? stats.savedCount > 0
                      ? "Unlimited saves"
                      : "Start saving"
                    : `${gateSavedCount}/${freeSaveLimit} free saves`
                }
                accent="sage"
              />
              <StatCard
                icon={DollarSign}
                label="Closet value"
                value={`$${stats.closetValue.toFixed(0)}`}
                hint={
                  stats.savedCount > 0
                    ? `Avg $${stats.avgOutfitPrice.toFixed(0)} / look`
                    : `~$${stats.estimatedSavings.toFixed(0)} est. savings`
                }
                accent="gold"
              />
              <StatCard
                icon={Grid3x3}
                label="Categories"
                value={String(stats.categoriesExplored)}
                hint={stats.topCategory ? `Top: ${stats.topCategory}` : "Explore feed"}
                accent="neutral"
              />
              <StatCard
                icon={Compass}
                label="Deal alerts"
                value={isPremium ? String(stats.dealAlerts.length) : "—"}
                hint={
                  isPremium
                    ? stats.dealAlerts.length > 0
                      ? "Price drops today"
                      : "Save looks to unlock"
                    : "Premium perk"
                }
                accent="neutral"
              />
            </StatsGrid>
          </View>

          <View style={styles.section}>
            <DealAlertsRow
              deals={stats.dealAlerts}
              isPremium={isPremium}
              onUpgrade={() => openPlans()}
            />
          </View>

          {stats.shopNext ? (
            <View style={styles.section}>
              <ShopNextCard product={stats.shopNext} />
            </View>
          ) : null}

          <View style={styles.section}>
            {isPremium ? (
              <PremiumPerksCard />
            ) : (
              <PremiumBanner
                imageUri={PROFILE_IMAGES.premium}
                onPress={() => openPlans()}
              />
            )}
          </View>

          <View style={styles.section}>
            <RecentSavesRow products={stats.savedProducts} />
          </View>

          <View style={styles.section}>
            {isPremium ? (
              <CategoryBreakdown
                breakdown={stats.categoryBreakdown}
                totalSaved={stats.savedCount}
              />
            ) : (
              <PremiumLockedCard
                title="Full closet insights"
                description="See category breakdowns, savings trends, and style stats with Premium."
                onUpgrade={() => openPlans()}
                onPress={() => openPlans()}
              />
            )}
          </View>

          <View style={styles.section}>
            <ActivityFeed
              savedProducts={stats.savedProducts}
              isPremium={isPremium}
              categoriesExplored={stats.categoriesExplored}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Alerts</Text>
            <NotificationPreferencesCard />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Account</Text>
            <GlassCard>
              <ProfileMenuRow icon={UserRound} label="Personal details" value={displayName} />
              <View style={styles.divider} />
              <ProfileMenuRow icon={Mail} label="Email" value={email} />
              <View style={styles.divider} />
              <ProfileMenuRow icon={Shield} label="Security" value="Password & sessions" />
              <View style={styles.divider} />
              <ProfileMenuRow
                icon={Sparkles}
                label="Membership"
                value={isPremium ? "Premium active" : "Upgrade available"}
                accent={isPremium}
                onPress={() =>
                  isPremium ? openSubscription() : openPlans()
                }
              />
            </GlassCard>
          </View>

          <View style={styles.section}>
            <AppButton
              label="Sign out"
              icon={LogOut}
              variant="outline"
              showArrow={false}
              onPress={() => void signOut()}
            />
          </View>
        </View>
      </ScrollView>

      <NotificationsSheet
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {paywallModal}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.4)",
  },
  divider: {
    marginHorizontal: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(26,26,26,0.06)",
  },
});
