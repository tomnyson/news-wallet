import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import {
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
} from '@stripe/stripe-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL // Replace with your backend URL

export default function GooglePayScreen() {
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay();

  React.useEffect(() => {
    const checkPlatformPaySupport = async () => {
      const supported = await isPlatformPaySupported({ googlePay: {
      testEnv: true, // Set to true for development
      merchantName: 'My Merchant Name',
      merchantCountryCode: 'US',
    }, });
      if (!supported) {
        Alert.alert('Google Pay is not supported on this device.');
      }
    };

    checkPlatformPaySupport();
  }, []);

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/api/payment-sheet-googlepay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'usd', // Define your preferred currency
        }),
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent client secret:', error);
      Alert.alert('Error', 'Unable to fetch client secret.');
      return null;
    }
  };

  const pay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();
    if (!clientSecret) return;

    const { error } = await confirmPlatformPayPayment(clientSecret, {
      googlePay: {
        testEnv: true, // Set to false for production
        merchantName: 'My Merchant Name',
        merchantCountryCode: 'US',
        currencyCode: 'USD',
        billingAddressConfig: {
          format: PlatformPay.BillingAddressFormat.Full,
          isPhoneNumberRequired: true,
          isRequired: true,
        },
      },
    });

    if (error) {
      Alert.alert('Payment Error', error.message);
      return;
    }

    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  return (
    <View style={styles.container}>
      <PlatformPayButton
        type={PlatformPay.ButtonType.googlePay}
        onPress={pay}
        style={styles.payButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  payButton: {
    width: '100%',
    height: 50,
  },
});