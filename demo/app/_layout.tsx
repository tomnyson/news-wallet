import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import { ImageBackground } from 'react-native'
import { useColorScheme } from '@/hooks/useColorScheme'
import { StripeProvider } from '@stripe/stripe-react-native'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'
import CustomHeader from '@/components/ui/CustomHeader'
import newService from '@/services/newService'

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
})

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [settings, setSettings] = useState([])
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })


  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 3000)
      fetchSetting()
    }
  }, [loaded])

  const fetchSetting = async () => {
    try {
      const response = await newService.getSettings()
      setSettings(response)
      console.log('seting', response)
    } catch (error) {
      console.error(error)
    }
  }

  if (!loaded) {
    return (
      <ImageBackground
        source={require('@/assets/images/splash_screen.png')}
        accessible
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    )
  }

  const IS_MODE_PROD = settings.some((item) => item.key === 'MODE' && (item.value === 'production' || item.value === 'prod'));
  console.log('settings', settings)
  console.log('IS_MODE_PROD', IS_MODE_PROD)
  const STRIPE_PUBLISHABLE_KEY = IS_MODE_PROD
    ? settings.find((item) => item.key === 'STRIPE_PUBLIC_PROD')?.value || process.env.EXPO_PUBLIC_STRIPE_KEY
    : settings.find((item) => item.key === 'STRIPE_PUBLIC_DEV')?.value || process.env.EXPO_PUBLIC_STRIPE_KEY;
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="splash" screenOptions={{}}>
          <Stack.Screen
            name="splash"
            options={{ headerShown: true, header: () => <CustomHeader /> }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{ headerShown: true, header: () => <CustomHeader /> }}
          />
          <Stack.Screen
            name="signup"
            options={{ headerShown: true, header: () => <CustomHeader /> }}
          />
          <Stack.Screen
            name="forgot"
            options={{ headerShown: true, header: () => <CustomHeader /> }}
          />

          <Stack.Screen
            name="articles"
            options={{ headerShown: true, header: () => <CustomHeader /> }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </StripeProvider>
  )
}
