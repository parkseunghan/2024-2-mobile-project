import api from '../api';

export const communityApi = {
  // 게시글 관련 API
  getPosts: (category, page = 1) => 
    api.get('/community/posts', { params: { category, page } }),
  
  getPost: (id) => 
    api.get(`/community/posts/${id}`),
  
  createPost: (formData) => 
    api.post('/community/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updatePost: (id, formData) => 
    api.put(`/community/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deletePost: (id) => 
    api.delete(`/community/posts/${id}`),
  
  // 좋아요 관련 API
  toggleLike: (id) => 
    api.post(`/community/posts/${id}/like`),
  
  // 댓글 관련 API
  createComment: (postId, content) => 
    api.post(`/community/posts/${postId}/comments`, { content }),
}; 