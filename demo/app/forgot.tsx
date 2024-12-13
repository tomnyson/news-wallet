import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { useRouter } from 'expo-router'
import { forgotPassword } from '@/services/auth'

export default function ForgotScreen() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email field cannot be empty')
      return false
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address')
      return false
    }

    return true
  }

  const handleForgot = async () => {
    if (!validateEmail()) return

    setLoading(true)
    try {
      const response = await forgotPassword({ email })
      if (!response && !response.message) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An unexpected error occurred. Please try again.',
        })
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Check your email for password reset.',
        })
        router.push('/login')
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response.data.message || 'Invalid credentials.',
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An unexpected error occurred. Please try again.',
        })
      }
    } finally {
      setLoading(false)
    }
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
       {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleForgot} disabled={loading}>
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

      <Toast />
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
})