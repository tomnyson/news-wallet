import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Button,

  ActivityIndicator,
} from 'react-native'
import { useStripe } from '@stripe/stripe-react-native'
// import SubscriptionPicker from '../components/SubscriptionPicker'
const { width: screenWidth } = Dimensions.get('window')
import { PlatformPayButton, usePlatformPay } from '@stripe/stripe-react-native'
import { router, useNavigation } from 'expo-router'
import newService from '@/services/newService'
import {checkTokenValidity} from '@/services/auth';
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function WalletScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [cardDetails, setCardDetails] = useState(null)
  const [cardError, setCardError] = useState(null)
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay()
  const { confirmPayment } = useStripe()
  const [subscription, setSubscription] = useState('12')
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()
  const navigation = useNavigation()

  useEffect(() => {
    console.log('Checking auth...');
    checkAuth();

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await newService.getCurrentUser()
        setCurrentUser(response.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
        Alert.alert('Error', 'Failed to fetch user data.')
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [router]);

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
          if (isValid && isValid.status == 401) {
            console.warn('Invalid token. Redirecting to login.');
            router.push('/login');
          }
        } catch (err) {
          console.error('Error checking token validity:', err);
        }
        
      }else {
        console.warn('No token found. Redirecting to login.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )
  }

  if (!currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No user data available. Please try again later.</Text>
      </View>
    )
  }

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text>
          {item.transaction_id ? `${item.transaction_id.substring(0, 20)}...` : 'No Transaction ID'}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.created_at).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Text>
        <Text style={styles.transactionDate}>{item.method}</Text>
      </View>
      <View>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'Withdraw' ? styles.negativeAmount : styles.positiveAmount,
          ]}
        >
          ${item.amount}
        </Text>
        <Text style={styles.transactionStatus}>{item.type}</Text>
      </View>
    </View>
  )


  const renderSubscriptionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text>
          {item.package.name}
        </Text>
        <Text style={styles.transactionDate}>
          ngày mua: {new Date(item.created_at).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Text>
       <Text style={styles.transactionDate}>
       ngày hết hạn: {new Date(item.expires_at).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Text>
      </View>
      <View>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'Withdraw' ? styles.negativeAmount : styles.positiveAmount,
          ]}
        >
          ${item.package.price}
        </Text>
      </View>
    </View>
  )

  // Payment request configuration
  const paymentRequest = {
    amount: 50.0, // Amount in dollars
    currency: 'USD',
    billingAddressRequired: true,
  }

  const handlePayPress = async () => {
    console.log('handlePayPress', cardDetails)
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('http://your-backend.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const { clientSecret } = await response.json()

      // Confirm the payment
      const { error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      })
      // Call your backend to create a Payment Intent
      if (error) {
        Alert.alert('Payment failed', error.message)
      } else {
        Alert.alert('Payment successful', 'Thank you for your payment!')
      }
    } catch (error) {
      console.error('Payment error', error)
      Alert.alert('Payment error', error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleSelectSubscription = (value) => {
    console.log('Selected subscription:', value)
    setSubscription(value)
  }

  return (
    <View style={styles.container}>
      {/* Wallet Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${currentUser?.wallet.balance}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>  router.push('/(tabs)/users/deposit')}
        >
          <Text style={styles.actionText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.withdrawButton]}
          onPress={() =>  router.push('/(tabs)/users/subscription')}
        >
          <Text style={styles.actionText}>Buy Package</Text>
        </TouchableOpacity>
      </View>
      {/* Transaction History */}
      <Text style={styles.historyTitle}>Payment History</Text>
      <FlatList
        data={currentUser?.transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.historyList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history available.</Text>
          </View>
        )}
      />
      <Text style={styles.historyTitle}>Package Purchase History</Text>
      <FlatList
        data={currentUser?.subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderSubscriptionItem}
        contentContainerStyle={styles.historyList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history available.</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  balanceContainer: {
    backgroundColor: '#003366',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  balanceTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  withdrawButton: {
    backgroundColor: '#FF5A5F',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 10,
  },
  historyList: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  positiveAmount: {
    color: '#4CAF50', // Green for deposits
  },
  negativeAmount: {
    color: '#FF5A5F', // Red for withdrawals
  },
  transactionStatus: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  payButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
})
