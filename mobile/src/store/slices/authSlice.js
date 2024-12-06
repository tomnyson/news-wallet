// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api'
// auth function handle

export const login = createAsyncThunk('api/login', async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post('/api/login', { email, password });
      console.log('response', response);
      const token = response.access_token;
  
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('token', token);
  
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
    }
  });

  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    },
    reducers: {
      logout: (state) => {
        state.token = null;
        state.isAuthenticated = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload;
          state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { logout } = authSlice.actions;
  export default authSlice.reducer;