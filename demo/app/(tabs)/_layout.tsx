import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import CustomHeader from '@/components/ui/CustomHeader'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        header: ({ navigation }) => <CustomHeader  />,
        tabBarActiveTintColor: '#00008B',
        headerShown: true,
        tabBarShowLabel: false,
        headerTitleAlign: 'center',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerTitle: 'HOME',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="explore.fill" color={color} />,
          headerTitle: 'CATEGORIES',
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="bookmark"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bookmark.fill" color={color} />,
          headerTitle: 'ĐÃ LƯU',
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="articles"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
          headerTitle: 'BÀI VIẾT',
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          headerTitle: 'CÁ NHÂN',
          tabBarShowLabel: false,
        }}
      
      />
    </Tabs>
  )
}
