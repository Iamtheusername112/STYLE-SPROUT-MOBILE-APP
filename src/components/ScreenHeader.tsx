import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
}

export function ScreenHeader({ title, subtitle, rightElement }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-b border-charcoal/5 bg-cream px-5 pb-4"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-end justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[3px] text-sage">
            Style Sprout
          </Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-charcoal">
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-sm text-charcoal/50">{subtitle}</Text>
          ) : null}
        </View>
        {rightElement}
      </View>
    </View>
  );
}
