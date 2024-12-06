import { client } from './client';  // client import 추가

export const adminApi = {
  // 사용자 관리 API
  getUsers: async ({ page = 1, limit = 20, search = '' }) => {
    const response = await client.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await client.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await client.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // 카테고리 관리 API
  getCategories: () => 
    client.get('/admin/categories'),

  createCategory: (categoryData) => 
    client.post('/admin/categories', categoryData),

  updateCategory: (categoryId, categoryData) => 
    client.put(`/admin/categories/${categoryId}`, categoryData),

  deleteCategory: (categoryId) => 
    client.delete(`/admin/categories/${categoryId}`),
};