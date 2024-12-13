import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'

import { useRouter } from 'expo-router'
import { forgotPassword } from '@/services/auth'
const API = process.env.EXPO_PUBLIC_API_URL
export default function ForgotScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleForgot = async () => {
    if (!email) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    try {
      setLoading(true)
      const response = await forgotPassword({ email })
      if (response && response.status) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.')
      } else {
        Alert.alert('Success', 'Check your email for password reset')
        router.push('/login')
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials')
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleForgot}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>SEND EMAIL</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signUpLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>I have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.signUpLink}> Signin</Text>
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
  forgotPassword: {
    color: '#003366',
    fontSize: 14,
    marginBottom: 20,
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
