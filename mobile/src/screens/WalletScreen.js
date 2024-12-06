import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert, Button } from 'react-native'
import { CardField, useStripe, CardFieldInput } from '@stripe/stripe-react-native'
import SubscriptionPicker from '../components/SubscriptionPicker'
const { width: screenWidth } = Dimensions.get('window')
import {PlatformPayButton, usePlatformPay} from '@stripe/stripe-react-native';

export default function WalletScreen({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [cardDetails, setCardDetails] = useState(null)
  const [cardError, setCardError] = useState(null)
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    isPlatformPaySupported,
    confirmPlatformPayPayment,
  } = usePlatformPay();

  const [loading, setLoading] = useState(false)
  const { confirmPayment } = useStripe()
  const [subscription, setSubscription] = useState('12')

  // Sample data for transaction history
  const transactions = [
    { id: '1', type: 'Deposit', amount: '+$500', date: '2024-12-01', status: 'Completed' },
    { id: '2', type: 'Withdraw', amount: '-$200', date: '2024-12-02', status: 'Pending' },
    { id: '3', type: 'Deposit', amount: '+$300', date: '2024-11-30', status: 'Completed' },
  ]

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'Withdraw' ? styles.negativeAmount : styles.positiveAmount,
          ]}
        >
          {item.amount}
        </Text>
        <Text style={styles.transactionStatus}>{item.status}</Text>
      </View>
    </View>
  )

  // Payment request configuration
  const paymentRequest = {
    amount: 50.0, // Amount in dollars
    currency: 'USD',
    billingAddressRequired: true,
  }

  const fetchPaymentSheetParams = async () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async ({navigator}) => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error`, error.message);
    } else {
      Alert.alert(`Success`, `Your payment was confirmed!`);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

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
        <Text style={styles.balanceAmount}>$1,500</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.actionText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.withdrawButton]}
          onPress={() => console.log('Withdraw')}
        >
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
      {/* Transaction History */}
      <Text style={styles.historyTitle}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.historyList}
      />
      <SubscriptionPicker onChange={handleSelectSubscription} />
      <Button
        variant="primary"
        // disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
        <Button
        variant="primary"
        // disabled={!loading}
        title="Checkout Google Pay"
        onPress={() =>  navigation.navigate('BottomTabs', { screen: 'GooglePay' })}
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
})
