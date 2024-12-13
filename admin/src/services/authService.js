import api from './api'

const handleApiError = (error) => {
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
    return error.response;
  } else if (error.request) {
    console.error('Request error:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  return null;
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
      return api.get(`/users/${id}`).catch(handleApiError);
    },
    deleteUser(id) {
      return api.delete(`/users/${id}`).catch(handleApiError);
    },
    addUser(payload) {
      return api.post('/users', payload).catch(handleApiError);
    },
    updateUser(id, payload) {
      return api.put(`/users/${id}`, payload).catch(handleApiError);
    },
  };
  
  export default authService;