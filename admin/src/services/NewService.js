import api from './api';

// Helper function to handle API errors
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
};

const NewService = {
  // Categories
  getCategories() {
    return api.get('/categories').catch(handleApiError);
  },
  addCategory(payload) {
    return api.post('/categories', payload).catch(handleApiError);
  },
  updateCategory(id, payload) {
    return api.put(`/categories/${id}`, payload).catch(handleApiError);
  },
  deleteCategory(id) {
    return api.delete(`/categories/${id}`).catch(handleApiError);
  },

  // Tags
  getTags() {
    return api.get('/tags').catch(handleApiError);
  },
  addTag(payload) {
    return api.post('/tags', payload).catch(handleApiError);
  },
  updateTag(id, payload) {
    return api.put(`/tags/${id}`, payload).catch(handleApiError);
  },
  deleteTag(id) {
    return api.delete(`/tags/${id}`).catch(handleApiError);
  },

  // Posts
  getPosts() {
    return api.get('/posts').catch(handleApiError);
  },
  addPost(payload) {
    return api.post('/posts', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(handleApiError);
  },
  deletePost(id) {
    return api.delete(`/posts/${id}`).catch(handleApiError);
  },

  // Packages

   getPackages() {
    return api.get('/packages').catch(handleApiError);
  },
  addPackages(payload) {
    return api.post('/packages', payload).catch(handleApiError);
  },
  updatePackages(id, payload) {
    return api.put(`/packages/${id}`, payload).catch(handleApiError);
  },
  deletePackages(id) {
    return api.delete(`/packages/${id}`).catch(handleApiError);
  },
};

export default NewService;