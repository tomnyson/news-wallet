import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native'
import newService from '@/services/newService'
import { useNavigation, useRouter } from 'expo-router'
import { useStripe, usePlatformPay, PlatformPay } from '@stripe/stripe-react-native'
import { checkTokenValidity } from '@/services/auth'
import { Colors } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'

export default function DepositScreen() {
  const [loading, setLoading] = useState(true)
  const [selectedValue, setSelectedValue] = useState(0)
  const [amount, setAmount] = useState(0)
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  const router = useRouter()

  const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe()
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay()

  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuth()
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    setLoading(true)
    if ((amount || selectedValue) > 0) {
      console.log('amount:', amount)
      initializePaymentSheet()
    }
    setLoading(false)
  }, [amount, selectedValue])

  const fetchPaymentSheetParams = async () => {
    const payload = {
      price: Number(amount || selectedValue),
      currency: 'usd',
    }
    const response = await newService.createPaymentSheet(payload)
    const { paymentIntent, ephemeralKey, customer } = await response
    setPaymentIntentId(paymentIntent)
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    }
  }

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams()

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Tomnysontech.com',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    })
    console.log('error initial', error)
    if (!error) {
      setLoading(false)
    }
  }

  const amounts = [10, 20, 30, 50, 100]
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()
    if (error) {
      Alert.alert(`Error`, error.message)
    } else {
      Alert.alert(`Success`, `Your payment was confirmed!`)
      console.log('paymentIntentId', paymentIntentId)
      await newService.saveTransaction({
        transaction_id: paymentIntentId,
        amount: Number(amount || selectedValue),
        method: 'stripe',
        status: 'completed',
      })
    }
  }

  // google pay handler

  useEffect(() => {
    const checkPlatformPaySupport = async () => {
      const supported = await isPlatformPaySupported({
        googlePay: {
          testEnv: true,
          merchantName: 'HSnews',
          merchantCountryCode: 'US',
        },
      })
      if (!supported) {
        Toast.show({
          type: 'error',
          text1: "Google Pay",
          text2: 'Google Pay is not supported on this device.',
        })
      }
    }
    checkPlatformPaySupport()
  }, [])

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

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const payload = {
        currency: 'usd',
      }
      setLoading(true)
      const response = await newService.createPaymentGooglePaySheet(payload)
      const { clientSecret } = await response
      setLoading(false)
      return clientSecret
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to fetch client secret.',
      })
      return null
    }
  }

  const handleGooglePay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret()
    if (!clientSecret) return

    const { error } = await confirmPlatformPayPayment(clientSecret, {
      googlePay: {
        testEnv: true, // Set to false for production
        merchantName: 'HSnews',
        merchantCountryCode: 'US',
        currencyCode: 'USD',
        billingAddressConfig: {
          format: PlatformPay.BillingAddressFormat.Full,
          isPhoneNumberRequired: true,
          isRequired: true,
        },
      },
    })

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      })
      return
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'The payment was confirmed successfully.',
    })
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>
      <Text style={styles.label}>Enter the amount to deposit:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount in $"
        value={amount}
        defaultValue={selectedValue}
        onChangeText={(text) => {
          setAmount(text)
          setSelectedValue(text)
        }}
      />
      <FlatList
        data={amounts}
        keyExtractor={(item, index) => index.toString()}
        extraData={amount}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.package, item === amount && styles.selectedPackage]}
            onPress={() => {
              setSelectedValue(item)
              setAmount(item)
              setLoading(false)
            }}
          >
            <Text style={styles.packagePrice}>${item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history available.</Text>
          </View>
        )}
      />
      {(amount > 0 || selectedValue > 0) && (
        <>
          <Text style={styles.paymentHeader}>Payment Methods</Text>
          <TouchableOpacity style={[styles.button, styles.stripeButton]} onPress={openPaymentSheet} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Stripe</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.googlePayButton]}
            onPress={handleGooglePay}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Google Pay</Text>
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
    borderColor: '#007bff',
    borderWidth: 2,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '500',
  },
  packagePrice: {
    fontSize: 16,
    color: '#888',
  },
  packageDuration: {
    fontSize: 16,
    marginVertical: 5,
    color: '#888',
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
    backgroundColor: '#EA4335',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  stripeButton: {
    backgroundColor: '#6772e5',
  }
})
