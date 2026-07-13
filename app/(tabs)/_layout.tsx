import { Tabs } from "expo-router";
import { Compass, Heart, LayoutDashboard } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4A6741",
        tabBarInactiveTintColor: "#1A1A1A66",
        tabBarStyle: {
          backgroundColor: "#FAF7F2",
          borderTopColor: "#1A1A1A0D",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Compass size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
