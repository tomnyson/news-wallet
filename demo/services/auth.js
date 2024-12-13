import api from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const handleApiError = (error) => {
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);

    if (error.response.status === 401) {
      console.warn('Unauthorized access (401). Redirecting to login...');
      // Example: Trigger a logout, clear tokens, or redirect to login
      // localStorage.removeItem('authToken'); // Clear token
      // window.location.href = '/login';      // Redirect to login page
      // Return a specific message or object if needed
      return { message: 'Unauthorized. Please log in again.', status: 401 };
    }

    return error.response;
  } else if (error.request) {
    console.error('Request error:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  
  return null;
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post('/api/login', { email, password }).catch(handleApiError)
    return response
  } catch (error) {
    console.error('Login failed:', error)
  }
}

export const register = async (payload) => {
  try {
    const response = await api.post('/api/register', payload).catch(handleApiError)
    return response
  } catch (error) {
    console.error('Login failed:', error)
  }
}

export const forgotPassword = async (payload) => {
  try {
    const response = await api.post('/api/forgot', payload).catch(handleApiError)
    return response
  } catch (error) {
    console.error('Login failed:', error)
  }
}

export const checkTokenValidity = async () => {
  try {
    const response = await api
      .get('/api/check-token')
    return response
  } catch (error) {
   return error
  }
}
