import { Bell, BellOff, Crown, Heart, Sparkles, Tag } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Switch, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { useNotifications } from "@/src/contexts/NotificationContext";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import type { NotificationPreferences } from "@/src/types/notification";

interface ToggleRowProps {
  icon: LucideIcon;
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  value,
  disabled,
  onValueChange,
}: ToggleRowProps) {
  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={styles.rowIcon}>
        <Icon size={16} color="#4A6741" />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        trackColor={{ false: "#E8E4DD", true: "rgba(74,103,65,0.35)" }}
        thumbColor={value ? "#4A6741" : "#FFFFFF"}
      />
    </View>
  );
}

export function NotificationPreferencesCard() {
  const { requestPermissions } = useNotifications();
  const preferences = useNotificationStore((state) => state.preferences);
  const setPreferences = useNotificationStore((state) => state.setPreferences);

  const updatePreference = async (patch: Partial<NotificationPreferences>) => {
    if (patch.pushEnabled && !preferences.pushEnabled) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    await setPreferences(patch);
  };

  const masterEnabled = preferences.enabled;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          {masterEnabled ? (
            <Bell size={18} color="#4A6741" />
          ) : (
            <BellOff size={18} color="#A88758" />
          )}
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Alerts & notifications</Text>
          <Text style={styles.subtitle}>
            Control in-app alerts and device notifications for saves, deals, and
            drops.
          </Text>
        </View>
      </View>

      <ToggleRow
        icon={Bell}
        label="All notifications"
        description="Master switch for alerts in Style Sprout"
        value={preferences.enabled}
        onValueChange={(enabled) => void updatePreference({ enabled })}
      />

      <ToggleRow
        icon={Tag}
        label="Deal alerts"
        description="Price drops on saved looks (Premium)"
        value={preferences.dealAlerts}
        disabled={!masterEnabled}
        onValueChange={(dealAlerts) => void updatePreference({ dealAlerts })}
      />

      <ToggleRow
        icon={Sparkles}
        label="Premium drops"
        description="Exclusive curated collections"
        value={preferences.premiumDrops}
        disabled={!masterEnabled}
        onValueChange={(premiumDrops) => void updatePreference({ premiumDrops })}
      />

      <ToggleRow
        icon={Heart}
        label="Closet updates"
        description="Saves, goals, and wardrobe milestones"
        value={preferences.closetGoals}
        disabled={!masterEnabled}
        onValueChange={(closetGoals) => void updatePreference({ closetGoals })}
      />

      <ToggleRow
        icon={Crown}
        label="Push notifications"
        description="Show alerts on your lock screen"
        value={preferences.pushEnabled}
        disabled={!masterEnabled}
        onValueChange={(pushEnabled) => void updatePreference({ pushEnabled })}
      />

      <View style={styles.cta}>
        <AppButton
          label="Enable device alerts"
          icon={Bell}
          variant="secondary"
          size="sm"
          showArrow={false}
          onPress={() => void requestPermissions()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
    gap: 14,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,103,65,0.1)",
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(26,26,26,0.5)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: "rgba(26,26,26,0.45)",
  },
  cta: {
    marginTop: 4,
  },
});
