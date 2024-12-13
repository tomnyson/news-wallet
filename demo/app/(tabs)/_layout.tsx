import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { HapticTab } from '@/components/HapticTab'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import CustomHeader from '@/components/ui/CustomHeader'
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  // const segments = useSegments();
  // const hide = segments.includes('articles');
  return (
    <Tabs
      screenOptions={{
        header: ({ navigation }) => <CustomHeader  />,
        tabBarActiveTintColor: Colors.light.primary,
        headerShown: true,
        tabBarShowLabel: false,
        headerTitleAlign: 'center',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            paddingVertical: 20,
            paddingHorizontal: 20,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) =><Feather name="home" size={28} color={color} />,
          headerTitle: 'HOME',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => <Entypo name="compass" size={28} color={color} />,
          headerTitle: 'CATEGORIES',
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="bookmark"
        options={{
          tabBarIcon: ({ color }) => <Feather name="bookmark" size={28} color={color} />,
          headerTitle: 'ĐÃ LƯU',
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={28} color={color} />,
          headerTitle: 'CÁ NHÂN',
          tabBarShowLabel: false,
        }}
      
      />
    </Tabs>
  )
}
