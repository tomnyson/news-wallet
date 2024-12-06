import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async ({email, password}) => {
    try {
        const response = await api.post('/api/login', { email, password });
        const token = response.token;
        await AsyncStorage.setItem('token', token);
        return token
      } catch (error) {
        console.error('Login failed:', error);
      }
}