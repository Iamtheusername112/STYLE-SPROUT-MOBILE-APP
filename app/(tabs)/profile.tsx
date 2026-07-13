import { useAuth } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import {
  Heart,
  LogIn,
  Settings,
  Sparkles,
  UserPlus,
} from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthButton } from "@/src/components/auth/AuthButton";
import { UserDashboard } from "@/src/components/dashboard/UserDashboard";
import {
  PROFILE_IMAGES,
  ProfileBackdrop,
} from "@/src/components/profile/ProfileBackdrop";
import { GlassCard, StatTile } from "@/src/components/profile/ProfileUi";

const clerkConfigured = Boolean(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function ProfileScreen() {
  if (!clerkConfigured) {
    return <ProfileSetupView />;
  }

  return <ClerkProfileScreen />;
}

function ProfileSetupView() {
  const insets = useSafeAreaInsets();

  return (
    <ProfileBackdrop imageUri={PROFILE_IMAGES.guest} heroHeight={420}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
      >
        <Text className="text-[11px] font-semibold uppercase tracking-[3px] text-white/70">
          Style Sprout
        </Text>
        <Text className="mt-2 text-4xl font-bold leading-tight text-white">
          Your style{"\n"}wardrobe awaits
        </Text>

        <GlassCard className="mt-auto">
          <View className="p-6">
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-sage/10">
              <Settings size={22} color="#4A6741" />
            </View>
            <Text className="text-xl font-bold text-charcoal">
              Connect your account
            </Text>
            <Text className="mt-2 text-sm leading-6 text-charcoal/55">
              Add your Clerk publishable key to `.env` to enable sign-in,
              premium membership, and synced saves.
            </Text>
            <View className="mt-5 rounded-2xl bg-cream px-4 py-3">
              <Text className="font-mono text-xs text-charcoal/50">
                EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ProfileBackdrop>
  );
}

function ClerkProfileScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <ProfileLoadingView />;
  }

  if (!isSignedIn) {
    return <GuestProfileView />;
  }

  return <UserDashboard />;
}

function ProfileLoadingView() {
  const insets = useSafeAreaInsets();

  return (
    <ProfileBackdrop imageUri={PROFILE_IMAGES.hero} heroHeight={360}>
      <View
        className="flex-1 items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    </ProfileBackdrop>
  );
}

function GuestProfileView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ProfileBackdrop imageUri={PROFILE_IMAGES.guest} heroHeight={460}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 28,
          paddingHorizontal: 20,
          minHeight: "100%",
        }}
      >
        <View className="flex-1">
          <Text className="text-[11px] font-semibold uppercase tracking-[3px] text-white/70">
            Style Sprout
          </Text>
          <Text className="mt-3 text-[42px] font-bold leading-[48px] text-white">
            Curate your{"\n"}perfect closet
          </Text>
          <Text className="mt-4 max-w-[280px] text-base leading-6 text-white/75">
            Sign in to save SHEIN outfits, unlock premium collections, and build
            a wardrobe that grows with you.
          </Text>

          <View className="mt-8 flex-row gap-3">
            <StatTile label="Outfits" value="120+" />
            <StatTile label="Curators" value="50K" />
            <StatTile label="Deals" value="Daily" />
          </View>
        </View>

        <View className="mt-10">
          <GlassCard>
            <View className="p-5">
              <View className="mb-4 flex-row gap-3">
                <FeatureChip icon={Heart} label="Save looks" />
                <FeatureChip icon={Sparkles} label="Premium drops" />
              </View>
              <AuthButton
                label="Sign In to Style Sprout"
                icon={LogIn}
                onPress={() => router.push("/(auth)/sign-in" as Href)}
              />
              <View style={{ marginTop: 12 }}>
                <AuthButton
                  label="Create Free Account"
                  icon={UserPlus}
                  variant="secondary"
                  showArrow={false}
                  onPress={() => router.push("/(auth)/sign-up" as Href)}
                />
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </ProfileBackdrop>
  );
}

function FeatureChip({
  icon: Icon,
  label,
}: {
  icon: typeof Heart;
  label: string;
}) {
  return (
    <View className="flex-1 flex-row items-center rounded-2xl bg-cream px-3 py-3">
      <Icon size={16} color="#4A6741" />
      <Text className="ml-2 text-xs font-semibold text-charcoal">{label}</Text>
    </View>
  );
}
