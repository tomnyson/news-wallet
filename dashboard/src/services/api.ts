import axios from 'axios';

// Create an Axios instance with a base URL
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || 'https://api.example.com',
    timeout: 10000, // optional: timeout after 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to include the token in all requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Replace with your token storage method
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the login method
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/login', { email, password });
    return response.data; // Return the response data
  } catch (error: any) {
    throw error.response?.data || 'An error occurred during login';
  }
};

// Define additional API methods as needed
export const fetchUserData = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'An error occurred while fetching user data';
  }
};

// Export the Axios instance for other API calls
export default apiClient;