import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack,useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StripeProvider } from '@stripe/stripe-react-native'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'
import CustomHeader from '@/components/ui/CustomHeader'
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
})
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    return <ImageBackground
    source={require('@/assets/images/splash_screen.png')}
    accessible
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
/>
  }

  return (
    <StripeProvider publishableKey="pk_test_51Nc3APDQIUXW6VqVpY5zg2mV11WdnXOMmZbcVmXFuNzpwOVd2v2tTOMIVBIVwgXh4ZnIfxshekrdTh0WpfC5I9oK00pSqsJlI9">
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
      initialRouteName="splash"
      screenOptions={{
        
      }}>
        <Stack.Screen name="splash" options={{ headerShown: true, header: ()=> <CustomHeader/>  }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: true, header: ()=> <CustomHeader/>  }} />
        <Stack.Screen name="signup" options={{ headerShown: true, header: ()=> <CustomHeader/>  }} />
        <Stack.Screen name="forgot" options={{ headerShown: true, header: ()=> <CustomHeader/>  }} />
       
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </StripeProvider>
  );
}
