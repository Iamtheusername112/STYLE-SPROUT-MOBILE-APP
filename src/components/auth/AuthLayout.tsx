import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/src/components/profile/ProfileUi";
import { PROFILE_IMAGES } from "@/src/components/profile/ProfileBackdrop";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onBack: () => void;
  imageUri?: string;
  badge?: string;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  onBack,
  imageUri = PROFILE_IMAGES.guest,
  badge = "Style Sprout",
}: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-cream">
      <View style={[styles.hero, { height: 280 + insets.top }]}>
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={["#1A1A1A44", "#1A1A1A99", "#FAF7F2"]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 28,
          paddingHorizontal: 20,
        }}
      >
        <Pressable
          onPress={onBack}
          className="mb-8 h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>

        <Text className="text-[11px] font-semibold uppercase tracking-[3px] text-white/75">
          {badge}
        </Text>
        <Text className="mt-2 text-[34px] font-bold leading-[40px] text-white">
          {title}
        </Text>
        <Text className="mt-3 max-w-[300px] text-[15px] leading-[22px] text-white/75">
          {subtitle}
        </Text>

        <GlassCard className="mt-8">
          <View className="p-6">{children}</View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
});
