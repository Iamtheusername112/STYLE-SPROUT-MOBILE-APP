import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Crown } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <View
      className={`overflow-hidden rounded-3xl border border-white/60 bg-white/85 ${className}`}
      style={{
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 6,
      }}
    >
      {children}
    </View>
  );
}

interface StatTileProps {
  label: string;
  value: string;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <View className="flex-1 items-center rounded-2xl bg-white/20 px-3 py-4">
      <Text className="text-2xl font-bold text-white">{value}</Text>
      <Text className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
        {label}
      </Text>
    </View>
  );
}

interface ProfileMenuRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  accent?: boolean;
  onPress?: () => void;
}

export function ProfileMenuRow({
  icon: Icon,
  label,
  value,
  accent,
  onPress,
}: ProfileMenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center px-4 py-4 active:opacity-80"
    >
      <View
        className={`mr-3 h-11 w-11 items-center justify-center rounded-2xl ${
          accent ? "bg-gold/15" : "bg-cream"
        }`}
      >
        <Icon size={18} color={accent ? "#C9A87C" : "#4A6741"} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-charcoal">{label}</Text>
        {value ? (
          <Text className="mt-0.5 text-xs text-charcoal/45" numberOfLines={1}>
            {value}
          </Text>
        ) : null}
      </View>
      {accent ? (
        <View className="rounded-full bg-gold/15 px-2.5 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-gold">
            Pro
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

interface PremiumBannerProps {
  onPress: () => void;
  imageUri: string;
}

export function PremiumBanner({ onPress, imageUri }: PremiumBannerProps) {
  return (
    <View className="overflow-hidden rounded-3xl">
      <View className="relative min-h-[168px] justify-end overflow-hidden">
        <ImageBackground uri={imageUri} />
        <LinearGradient
          colors={["transparent", "#1A1A1AE6"]}
          style={StyleSheet.absoluteFill}
        />
        <View className="p-5">
          <Text className="text-[10px] font-bold uppercase tracking-[2px] text-gold">
            Sprout Premium
          </Text>
          <Text className="mt-1 text-lg font-bold leading-6 text-white">
            Unlock unlimited saves & exclusive drops
          </Text>
          <View className="mt-4 self-start" style={{ minWidth: 140 }}>
            <AppButton
              label="Upgrade"
              icon={Crown}
              variant="gold"
              size="sm"
              showArrow={false}
              onPress={onPress}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function ImageBackground({ uri }: { uri: string }) {
  return (
    <Image
      source={{ uri }}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      contentFit="cover"
    />
  );
}
