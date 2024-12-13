import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter, useNavigation, useRootNavigationState, useSegments } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightAction?: () => void;
  rightIcon?: string;
}

const routeTitleMap = {
  home: 'Home',
  about: 'About Us',
  contact: 'Contact Us',
  products: 'Our Products',
  bookmark: 'Bookmark',
  explore: 'Explore Us',
  login: 'Login',
  signup: 'Signup',
  users: 'Profile',
  forgot: 'Forgot Password',
  subscription: 'Subscription',
  'product-detail': 'Product Details',
  blog: 'Blog',
  'blog-detail': 'Blog Details',
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title = 'Default Title',
  showBackButton = true,
  rightAction,
  rightIcon
}) => {
  const router = useRouter();
  const segments = useSegments();
  const routeTitle = segments?.length
    ? routeTitleMap[segments[segments.length - 1]] || 'Home'
    : 'Home';
    
  console.log('segments', routeTitle);
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/header-background.jpg')}
      style={[
        styles.headerBackground,
        {
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }
      ]}
    >
      {router.canGoBack()  && (
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
        >
         <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{routeTitle}</Text>

      {rightAction && rightIcon && (
        <TouchableOpacity
          onPress={rightAction}
          style={styles.rightButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    // transform: [{ translateY: -12 }],
  },
  rightButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});

export default CustomHeader;