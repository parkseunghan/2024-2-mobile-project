const db = require('../config/database');

class Category {
  static async findAll() {
    try {
      const [categories] = await db.query(
        'SELECT * FROM post_categories ORDER BY name'
      );
      return categories;
    } catch (error) {
      console.error('카테고리 목록 조회 에러:', error);
      throw error;
    }
  }

  static async create({ name, description, created_by }) {
    try {
      const [result] = await db.execute(
        'INSERT INTO post_categories (name, description, created_by, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [name, description, created_by]
      );
      return {
        id: result.insertId,
        name,
        description,
        created_by
      };
    } catch (error) {
      console.error('카테고리 생성 에러:', error);
      throw error;
    }
  }

  static async update(id, { name, description }) {
    try {
      const [result] = await db.execute(
        'UPDATE post_categories SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('카테고리 수정 에러:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM post_categories WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('카테고리 삭제 에러:', error);
      throw error;
    }
  }
}

module.exports = Category; 