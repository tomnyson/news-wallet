import api from './api';

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

const getPosts = async (queryString) => {
  try {
    console.log('queryString', queryString);
    const response = await api.get('/api/guest/posts', { params: queryString });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

const getPostDetail = async (id) => {
      const response = await api.get(`/api/guest/posts/${id}`).catch(handleApiError);
      return response
}

const getPackages = async () => {
  const response = await api.get(`/api/packages`).catch(handleApiError);
  return response
}

const createPaymentSheet = async (payload) => {
  const response = await api.post(`/api/payment-sheet`,payload).catch(handleApiError);
  return response
}

const saveTransaction = async (payload) => {
  const response = await api.post(`/api/transactions`,payload).catch(handleApiError);
  return response
}

const getCurrentUser = async () => {
  const response = await api.get(`/api/current-user`).catch(handleApiError);
  return response
}

const getCategories = async (queryString) => {
  const response = await api.get('/api/guest/categories', {params: queryString}).catch(handleApiError)
  return response
}
const getTags = async (queryString) => {
  const response = await api.get('/api/guest/tags', {params: queryString}).catch(handleApiError)
  return response
}

const createSubscription = async (payload) => {
  const response = await api.post(`/api/subscriptions`,payload).catch(handleApiError);
  return response
}

const createPaymentGooglePaySheet = (payload) => {
  return api.post(`/api/payment-sheet-googlepay`,payload).catch(handleApiError);
}

const getBookmarks = async () => {
  const response = await api.get(`/api/bookmarks`).catch(handleApiError);
  return response
}
const createBookmark = async (payload) => {
  const response = await api.post(`/api/bookmarks`,payload).catch(handleApiError);
  return response
}

const removeBookmark = async (id) => {
  const response = await api.delete(`/api/bookmarks/${id}`).catch(handleApiError);
  return response
}

const getSettings = async () => {
  const response = await api.get(`/api/guest/settings`).catch(handleApiError);
  return response
}
const newService = {
    getPosts,
    getPostDetail,
    getPackages,
    createPaymentSheet,
    saveTransaction,
    getCurrentUser,
    getCategories,
    getTags,
    createSubscription,
    createPaymentGooglePaySheet,
    getBookmarks,
    createBookmark,
    removeBookmark,
    getSettings
};

export default newService