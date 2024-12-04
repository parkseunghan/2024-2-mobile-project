import { client } from './client';  // client import 추가

export const adminApi = {
  // 카테고리 관리 API
  getCategories: () => 
    client.get('/admin/categories'),

  createCategory: (categoryData) => 
    client.post('/admin/categories', categoryData),

  updateCategory: (categoryId, categoryData) => 
    client.put(`/admin/categories/${categoryId}`, categoryData),

  deleteCategory: (categoryId) => 
    client.delete(`/admin/categories/${categoryId}`)
};