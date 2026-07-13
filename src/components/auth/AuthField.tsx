import type { ReactNode } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

interface AuthFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

export function AuthField({
  label,
  error,
  rightElement,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <View className="mb-5">
      {label ? (
        <Text className="mb-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-charcoal/40">
          {label}
        </Text>
      ) : null}
      <View className="relative">
        <TextInput
          placeholderTextColor="#1A1A1A35"
          className={`rounded-2xl border bg-white px-4 py-4 text-base text-charcoal ${
            error ? "border-red-300" : "border-charcoal/8"
          } ${className ?? ""}`}
          {...props}
        />
        {rightElement}
      </View>
      {error ? (
        <Text className="mt-2 text-xs font-medium text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}
