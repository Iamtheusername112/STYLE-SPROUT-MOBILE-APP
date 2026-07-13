import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, Heart, Sparkles, Tag, X, Zap } from "lucide-react-native";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/src/components/ui/AppButton";
import { PROFILE_IMAGES } from "@/src/components/profile/ProfileBackdrop";
import { usePremiumCheckout } from "@/src/hooks/usePremiumCheckout";

export interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  productImage?: string;
  productTitle?: string;
  subtitle?: string;
  savesRemaining?: number;
  freeSaveLimit?: number;
}

const PERKS = [
  { icon: Heart, label: "Unlimited saves" },
  { icon: Zap, label: "Early drops" },
  { icon: Tag, label: "SHEIN deals" },
] as const;

export function PremiumModal({
  visible,
  onClose,
  onUpgrade,
  productImage,
  productTitle,
  subtitle,
  savesRemaining,
  freeSaveLimit,
}: PremiumModalProps) {
  const insets = useSafeAreaInsets();
  const { openPlans } = usePremiumCheckout();
  const heroImage = productImage ?? PROFILE_IMAGES.premium;
  const sheetBottom = Math.max(insets.bottom, 12) + 76;

  const handleUpgrade = () => {
    onClose();
    if (onUpgrade) {
      onUpgrade();
      return;
    }
    openPlans();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { marginBottom: sheetBottom }]}>
          <View style={styles.hero}>
            <Image
              source={{ uri: heroImage }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["rgba(26,26,26,0.15)", "rgba(26,26,26,0.75)", "#FAF7F2"]}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />

            <Pressable onPress={onClose} hitSlop={14} style={styles.closeBtn}>
              <X size={18} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>

            <View style={styles.heroContent}>
              <View style={styles.heartBadge}>
                <Heart size={22} color="#C9A87C" fill="#C9A87C" />
              </View>
              <Text style={styles.eyebrow}>STYLE SPROUT PREMIUM</Text>
              <Text style={styles.heroTitle}>
                {productTitle ? "Love this look?" : "Upgrade your closet"}
              </Text>
              {subtitle ? (
                <Text style={styles.heroSubtitle}>{subtitle}</Text>
              ) : productTitle ? (
                <Text style={styles.heroProduct} numberOfLines={2}>
                  {productTitle}
                </Text>
              ) : (
                <Text style={styles.heroSubtitle}>
                  Save outfits you adore and build your dream wardrobe.
                </Text>
              )}
              {savesRemaining !== undefined && freeSaveLimit !== undefined ? (
                <View style={styles.limitPill}>
                  <Text style={styles.limitPillText}>
                    {savesRemaining} of {freeSaveLimit} free saves left
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.perkRow}>
              {PERKS.map(({ icon: Icon, label }) => (
                <View key={label} style={styles.perkPill}>
                  <Icon size={13} color="#4A6741" strokeWidth={2.2} />
                  <Text style={styles.perkText}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceLeft}>
                <View style={styles.premiumTag}>
                  <Crown size={11} color="#C9A87C" />
                  <Text style={styles.premiumTagText}>Premium</Text>
                </View>
                <Text style={styles.priceLine}>
                  <Text style={styles.priceAmount}>$4.99</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </Text>
              </View>
              <Text style={styles.trialNote}>7-day free trial</Text>
            </View>

            <AppButton
              label="View plans & upgrade"
              icon={Crown}
              variant="gold"
              size="lg"
              onPress={handleUpgrade}
            />

            <View style={styles.laterSpacing}>
              <AppButton
                label="Maybe later"
                variant="secondary"
                showArrow={false}
                onPress={onClose}
              />
            </View>

            <View style={styles.trustRow}>
              <Sparkles size={12} color="#4A6741" />
              <Text style={styles.trustText}>Cancel anytime · No commitment</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,26,26,0.55)",
  },
  sheet: {
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FAF7F2",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  hero: {
    height: 220,
    justifyContent: "flex-end",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(26,26,26,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    zIndex: 2,
  },
  heroContent: {
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  heartBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    marginBottom: 12,
    shadowColor: "#C9A87C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
  heroProduct: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
    color: "rgba(255,255,255,0.88)",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.8)",
    maxWidth: 280,
  },
  limitPill: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  limitPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    backgroundColor: "#FAF7F2",
  },
  perkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  perkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(74,103,65,0.12)",
  },
  perkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  priceLeft: {
    gap: 4,
  },
  premiumTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "rgba(201,168,124,0.15)",
  },
  premiumTagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#A88758",
  },
  priceLine: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceAmount: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(26,26,26,0.45)",
  },
  trialNote: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A6741",
    textAlign: "right",
    maxWidth: 90,
    lineHeight: 17,
  },
  laterSpacing: {
    marginTop: 10,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  trustText: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(26,26,26,0.4)",
  },
});
