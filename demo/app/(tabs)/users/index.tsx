import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useNavigation } from 'expo-router'
import { IconSymbol } from '@/components/ui/IconSymbol'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import {checkTokenValidity} from '@/services/auth';

export default function ProfileScreen() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuth();
    });

    return unsubscribe;
  }, [navigation]);


  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const isValid = await checkTokenValidity(token);
          console.log('Token validity:', isValid);
          if (isValid && isValid.status == 401) {
            console.warn('Invalid token. Redirecting to login.');
          }
        } catch (err) {
          console.error('Error checking token validity:', err);
        }
        setIsAuthenticated(true)
        
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
  };

  const utilities = [
  //   { id: '1', name: 'Lịch Việt', icon: <FontAwesome name="calendar" size={24} color="black" />, path: '/(tabs)/users/utility',
  //   url: 'https://lichviet.app/'
  // },
  //   { id: '2', name: 'Thời tiết', icon: <Entypo name="light-up" size={24} color="black" />, path: '/(tabs)/users/utility',
  //   url: 'https://www.accuweather.com'
  // },
  //   { id: '3', name: 'Kết quả xổ số', icon: <Entypo name="circle" size={24} color="black" />, path: '/(tabs)/users/utility',
  //   url: 'https://www.kqxs.vn/'
  // },
  //   {
  //     id: '4',
  //     name: 'Giá vàng & Ngoại tệ',
  //     icon: <MaterialCommunityIcons name="gold" size={24} color="black" />,
  //     path: '/(tabs)/users/utility',
  //     url: 'https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/Ty-gia'
  //   },
  //   {
  //     id: '5',
  //     name: 'Tỷ số bóng đá',
  //     path: '/(tabs)/users/utility',
  //     url: 'https://baomoi.com/bong-da/livescore.epi',
  //     icon: <MaterialIcons name="sports-soccer" size={24} color="black" />
  //   },
    {
      id: '6',
      name: 'Wallet',
      icon: <MaterialIcons name="account-balance-wallet" size={24} color="#003366" />,
      path: '/(tabs)/users/wallet',
      url: ''
    },
  ]

  const logout = () => {
    AsyncStorage.removeItem('token')
    router.push('/login')
  }

  const handleAction = () => {
    if (isAuthenticated) {
      logout()
      router.push('/login')
    } else {
      router.push('/login')
    }
  }
  const renderUtilityItem = ({ item }) => (
    <TouchableOpacity style={styles.utilityItem} onPress={() => router.push(`${item.path}?url=${item.url}`)}>
      {item.icon}
      <Text style={styles.utilityText}>{item.name}</Text>
    </TouchableOpacity>
  )
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={require('@/assets/images/images-holder.png')} style={styles.avatar} />
        <TouchableOpacity onPress={handleAction}>
          <Text style={styles.profileName}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.savedOptions}>
        <View>
          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons name="bookmark" size={20} color="#003366" />
            <Text style={styles.optionText}>Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <AntDesign name="checksquare" size={24} color="#003366" />
            <Text style={styles.optionText}>Đang theo dõi</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.optionItem}>
            <MaterialCommunityIcons name="download-box" size={24} color="#003366" />
            <Text style={styles.optionText}>News downloaded</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons name="access-time-filled" size={24} color="black" />
            <Text style={styles.optionText}>Recently Read</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Utilities Section */}
      <Text style={styles.utilitiesTitle}>UTILITIES</Text>
      <FlatList
        data={utilities}
        keyExtractor={(item) => item.id}
        renderItem={renderUtilityItem}
        contentContainerStyle={styles.utilitiesList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00004A',
    marginLeft: 10,
  },
  savedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionItem: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 16,
  },
  optionText: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
    marginLeft: 10,
  },
  utilitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 20,
    paddingBottom: 10,
  },
  utilitiesList: {
  },
  utilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  utilityText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#555',
  },
})
