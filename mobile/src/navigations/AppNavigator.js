import React, {useState, useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons' // Icon library
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen'
import CategoriesScreen from '../screens/CategoriesScreen'
import BookmarkScreen from '../screens/BookmarkScreen'
import ProfileScreen from '../screens/ProfileScreen'
import WalletScreen from '../screens/WalletScreen'
import AuthStack from './AuthStack'
import GooglePayScreen from '../screens/GooglePayScreen'
import { createStackNavigator } from '@react-navigation/stack';

// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator()

const BottomTabs = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'Explore') {
              iconName = focused ? 'compass' : 'compass-outline'
            } else if (route.name === 'Bookmarks') {
              iconName = focused ? 'bookmark' : 'bookmark-outline'
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline'
            }
            else if (route.name === 'Wallet') {
              iconName = focused ? 'wallet' : 'wallet-outline'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#0000FF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#FFFFFF' },
          headerStyle: { backgroundColor: '#003366' }, // Header background color
          headerTintColor: '#FFFFFF', // Header text color
          headerTitleAlign: 'center', // Center align title
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'TRANG CHỦ',
            tabBarShowLabel: false,
          }}
        />
        <Tab.Screen
          name="Explore"
          component={CategoriesScreen}
          options={{
            title: 'CHUYÊN MỤC',
            tabBarShowLabel: false,
          }}
        />
        <Tab.Screen name="Bookmarks" component={BookmarkScreen}
            options={{
                title: 'ĐÃ LƯU',
                tabBarShowLabel: false,
              }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
            title: 'CÁ NHÂN',
            tabBarShowLabel: false,
          }}
        />
         <Tab.Screen name="Wallet" component={WalletScreen}
        options={{
            title: 'Ví',
            tabBarShowLabel: false,
          }}
        />
        <Tab.Screen name="GooglePay" component={GooglePayScreen}
        options={{
            title: 'GooglePay',
            tabBarShowLabel: false,
          }}
        />
      </Tab.Navigator>
  )
}
export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true); // If token exists, set authenticated to true
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false once check is complete
      }
    };

    checkAuthentication();
  }, []);



  if (loading) {
    // Optionally, show a loading screen or spinner while authentication status is being checked
    return <ActivityIndicator/>;
  }

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="AuthStack"
        screenOptions={{ headerShown: false }}
      >
       <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
