import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import newService from '@/services/newService'
import { useRouter, useNavigation } from 'expo-router'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {checkTokenValidity} from '@/services/auth'

export default function SubscriptionScreen() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await newService.getPackages()
        setPackages(response)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching articles:', error)
      }
    }
    fetchPackages()
  }, [])

  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuth()
    })

    return unsubscribe
  }, [navigation])

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        try {
          const isValid = await checkTokenValidity(token)
          if (isValid && isValid.status == 401) {
            console.warn('Invalid token. Redirecting to login.')
            router.push('/login')
          }
        } catch (err) {
          console.error('Error checking token validity:', err)
        }
      } else {
        console.warn('No token found. Redirecting to login.')
        router.push('/login')
      }
    } catch (error) {
      console.error('Authentication check error:', error)
    }
  }



  const handleBuySubscription = async () => {
    const payload = {
      package_id: selectedPackage.id,
    }
    const response = await newService.createSubscription(payload)
    if (response && !response.status) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Subscription purchased successfully',
      })
      router.back()
    } else {
      const error = response.data.message || 'Subscription purchase failed'
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      })
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Recharge Package</Text>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.package, selectedPackage?.id === item.id && styles.selectedPackage]}
            onPress={() => setSelectedPackage(item)}
          >
            <Text style={styles.packageName}>Name: {item.name}</Text>
            <Text style={styles.packagePrice}>Price: ${item.price}</Text>
            <Text style={styles.packageDuration}>Duration: ${item.duration}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedPackage && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={handleBuySubscription}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Pay</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  package: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPackage: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '500',
  },
  packagePrice: {
    fontSize: 16,
    color: Colors.light.secondary,
  },
  packageDuration: {
    fontSize: 16,
    marginVertical: 5,
    color: Colors.light.secondary,
  },
  paymentHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  cardContainer: {
    height: 50,
    marginVertical: 16,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  googlePayButton: {
    backgroundColor: Colors.light.success,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
