import api from '../api';

export const profileApi = {
  getProfile: () => api.get('/profile'),
  
  updateProfile: (formData) => api.put('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  getUserPosts: () => api.get('/profile/posts'),
  
  getUserComments: () => api.get('/profile/comments'),
  
  getLikedPosts: () => api.get('/profile/liked-posts'),
}; 