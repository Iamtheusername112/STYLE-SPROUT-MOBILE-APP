import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading outfits..." }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-cream px-6">
      <ActivityIndicator size="large" color="#4A6741" />
      <Text className="mt-4 text-sm font-medium tracking-wide text-charcoal/60">
        {message}
      </Text>
    </View>
  );
}
