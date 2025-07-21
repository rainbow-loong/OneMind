import { Tabs } from 'expo-router';
import { MessageCircle, Timer, Sparkles, User } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { AppProvider } from '@/context/AppContext';

export default function TabLayout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.surface2,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 80,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarLabelStyle: {
            fontSize: theme.typography.xs,
            fontFamily: theme.typography.medium,
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '对话',
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="timer"
          options={{
            title: '微行动',
            tabBarIcon: ({ size, color }) => (
              <Timer size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="crystals"
          options={{
            title: '成就',
            tabBarIcon: ({ size, color }) => (
              <Sparkles size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '我的',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppProvider>
  );
}