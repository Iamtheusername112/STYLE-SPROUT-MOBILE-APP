import { RefreshCw } from "lucide-react-native";
import { Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-cream px-8">
      <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-sage/10">
        <RefreshCw size={28} color="#4A6741" />
      </View>
      <Text className="mb-2 text-center text-lg font-semibold text-charcoal">
        Something went wrong
      </Text>
      <Text className="mb-8 text-center text-sm leading-5 text-charcoal/60">
        {message}
      </Text>
      <View className="w-full max-w-xs">
        <AppButton
          label="Try Again"
          icon={RefreshCw}
          onPress={onRetry}
          showArrow={false}
        />
      </View>
    </View>
  );
}
