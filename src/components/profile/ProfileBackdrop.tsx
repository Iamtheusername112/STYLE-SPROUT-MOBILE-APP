import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PROFILE_IMAGES = {
  hero: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85",
  guest: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85",
  premium: "https://images.unsplash.com/photo-1483985988355-763728e3685b?w=900&q=85",
  wardrobe: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=85",
} as const;

interface ProfileBackdropProps {
  imageUri: string;
  children: ReactNode;
  heroHeight?: number;
  fadeToCream?: boolean;
}

export function ProfileBackdrop({
  imageUri,
  children,
  heroHeight = 340,
  fadeToCream = true,
}: ProfileBackdropProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-cream">
      <View style={[styles.hero, { height: heroHeight + insets.top }]}>
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={400}
        />
        <LinearGradient
          colors={["#1A1A1A55", "#1A1A1A99", fadeToCream ? "#FAF7F2" : "#1A1A1ACC"]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["#4A674133", "transparent", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
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
