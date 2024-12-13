import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import newService from '@/services/newService';

import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';

export default function SubscriptionScreen() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        
        const response = await newService.getPackages();
              setPackages(response);
              setLoading(false)
       
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchPackages();
  }, []);


  const handleBuySubscription = async () => {
      const payload = {
        package_id: selectedPackage.id
      }
      const response = await newService.createSubscription(payload)
      if(response && !response.status) {
        Alert.alert('Success', 'Subscription purchased successfully');
        router.back();
      } else {
        console.log('response', response.data.message)
        const error = response.data.message || 'Subscription purchase failed';
        Alert.alert('Error', error);
      }

  }

  if(loading) {
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
            style={[
              styles.package,
              selectedPackage?.id === item.id && styles.selectedPackage,
            ]}
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
          <TouchableOpacity style={styles.button} onPress={handleBuySubscription} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
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
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  googlePayButton: {
    backgroundColor: '#34A853',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});