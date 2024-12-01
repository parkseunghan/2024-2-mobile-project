export const adminApi = {
  // 기존 코드...

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