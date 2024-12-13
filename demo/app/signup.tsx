import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { register } from '@/services/auth'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
          router.push('/(tabs)/users')
        }
      } catch (error) {
        console.error('Authentication check error:', error)
      }
    }

    checkAuth()
  }, [])

  const handleRegister = async () => {
    const validateFields = () => {
      if (!email || !password || !name || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields.');
        return false;
      }
  
      if (password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters.');
        return false;
      }
  
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return false;
      }
  
      return true;
    };
  
    if (!validateFields()) {
      return;
    }
  
    try {
      const response = await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
  
      if (response?.data) {
        const errorMessage = response.data.message || 'An unexpected error occurred.';
        Alert.alert('Registration Failed', errorMessage);
      } else {
        Alert.alert('Success', 'Registration successful!');
        router.push('/(tabs)/users');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Registration Failed', errorMessage);
      console.error('Registration error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.signUpLink}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#003366',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: '#555',
  },
  signUpLink: {
    fontSize: 14,
    color: '#003366',
    fontWeight: 'bold',
  },
})
