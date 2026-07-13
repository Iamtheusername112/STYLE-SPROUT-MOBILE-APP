import "../global.css";

import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, ClerkAuthBridge } from "@/src/contexts/AuthContext";
import { NotificationProvider } from "@/src/contexts/NotificationContext";
import { NotificationBanner } from "@/src/components/notifications/NotificationBanner";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="product/[id]"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(auth)/sign-in"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="(auth)/sign-up"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="(billing)/plans"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(billing)/checkout"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="(billing)/success"
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen
        name="(billing)/subscription"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  if (!publishableKey) {
    return (
      <AuthProvider>
        <NotificationProvider>
          <StatusBar style="dark" />
          <AppStack />
          <NotificationBanner />
        </NotificationProvider>
      </AuthProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ClerkAuthBridge>
          <NotificationProvider>
            <StatusBar style="dark" />
            <AppStack />
            <NotificationBanner />
          </NotificationProvider>
        </ClerkAuthBridge>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
