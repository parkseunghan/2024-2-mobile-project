import api from '../api';

export const profileApi = {
  getProfile: () => api.get('/profile', { requiresAuth: true }),
  
  updateProfile: (formData) => api.put('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requiresAuth: true
  }),
  
  getUserPosts: () => api.get('/profile/posts', { requiresAuth: true }),
  
  getUserComments: () => api.get('/profile/comments', { requiresAuth: true }),
  
  getLikedPosts: () => api.get('/profile/liked-posts', { requiresAuth: true })
}; 