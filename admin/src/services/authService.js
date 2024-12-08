import api from './api'

const handleApiError = (error) => {
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request error:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  throw error; // Re-throw to handle it further if necessary
}

const authService = {
    login(email, password) {
      return api.post('/login', { email, password });
    },
    signup(userData) {
      return api.post('/signup', userData);
    },
    getUserProfile() {
      return api.get('/profile');
    },
    getUsers() {
      return api.get('/users').catch(handleApiError);
    },
    getUserDetail(id) {
      console.log('getUserDetail', id);
      return api.get(`/users/${id}`).catch(handleApiError);
    }
  };
  
  export default authService;