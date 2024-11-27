const db = require('../config/database');

/**
 * 게시글 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class Post {
  /**
   * 새로운 게시글을 생성합니다.
   * @param {number} userId - 작성자 ID
   * @param {Object} postData - 게시글 데이터
   * @param {string} postData.title - 제목
   * @param {string} postData.content - 내용
   * @param {string} postData.category - 카테고리
   * @param {string} [postData.mediaUrl] - 미디어 URL
   * @returns {Promise<number>} 생성된 게시글의 ID
   */
  static async create(userId, { title, content, category, mediaUrl }) {
    try {
      console.log('Creating post in database:', { userId, title, content, category, mediaUrl });

      const [result] = await db.query(
        `INSERT INTO posts 
        (user_id, title, content, category, media_url) 
        VALUES (?, ?, ?, ?, ?)`,
        [userId, title, content, category, mediaUrl]
      );

      console.log('Post created with ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Post creation error:', error);
      throw new Error('게시글 생성에 실패했습니다.');
    }
  }

  /**
   * ID로 게시글을 조회합니다.
   * @param {number} postId - 게시글 ID
   * @returns {Promise<Object|null>} 게시글 정보
   */
  static async findById(postId) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               u.username as author_name,
               COUNT(DISTINCT pl.id) as like_count,
               COUNT(DISTINCT c.id) as comment_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE p.id = ? AND p.is_deleted = false
        GROUP BY p.id
      `, [postId]);
      return rows[0];
    } catch (error) {
      console.error('게시글 조회 에러:', error);
      throw new Error('게시글 조회에 실패했습니다.');
    }
  }

  /**
   * 게시글 목록을 조회합니다.
   * @param {string|null} category - 카테고리
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 항목 수
   * @returns {Promise<Array>} 게시글 목록
   */
  static async findAll(category = null, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT p.*, 
               u.username as author_name,
               COUNT(DISTINCT pl.id) as like_count,
               COUNT(DISTINCT c.id) as comment_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE p.is_deleted = false
      `;
      
      const params = [];
      if (category) {
        query += ' AND p.category = ?';
        params.push(category);
      }
      
      query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('게시글 목록 조회 에러:', error);
      throw new Error('게시글 목록 조회에 실패했습니다.');
    }
  }

  /**
   * 사용자가 작성한 게시글을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 게시글 목록
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               u.username as author_name,
               COUNT(DISTINCT pl.id) as like_count,
               COUNT(DISTINCT c.id) as comment_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE p.user_id = ? AND p.is_deleted = false
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `, [userId]);
      return rows;
    } catch (error) {
      console.error('사용자 게시글 조회 에러:', error);
      throw new Error('게시글 조회에 실패했습니다.');
    }
  }

  /**
   * 사용자가 좋아요한 게시글을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 게시글 목록
   */
  static async findLikedByUserId(userId) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               u.username as author_name,
               COUNT(DISTINCT pl2.id) as like_count,
               COUNT(DISTINCT c.id) as comment_count
        FROM posts p
        INNER JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN post_likes pl2 ON p.id = pl2.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE pl.user_id = ? AND p.is_deleted = false
        GROUP BY p.id
        ORDER BY pl.created_at DESC
      `, [userId]);
      return rows;
    } catch (error) {
      console.error('좋아요 게시글 조회 에러:', error);
      throw new Error('게시글 조회에 실패했습니다.');
    }
  }

  /**
   * 게시글을 수정합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 작성자 ID
   * @param {Object} updateData - 수정할 데이터
   * @returns {Promise<boolean>} 수정 성공 여부
   */
  static async update(postId, userId, { title, content, mediaUrl }) {
    try {
      const [result] = await db.query(
        'UPDATE posts SET title = ?, content = ?, media_url = ? WHERE id = ? AND user_id = ? AND is_deleted = false',
        [title, content, mediaUrl, postId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('게시글 수정 에러:', error);
      throw new Error('게시글 수정에 실패했습니다.');
    }
  }

  /**
   * 게시글을 삭제합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 작성자 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  static async delete(postId, userId) {
    try {
      const [result] = await db.query(
        'UPDATE posts SET is_deleted = true WHERE id = ? AND user_id = ?',
        [postId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
      throw new Error('게시글 삭제에 실패했습니다.');
    }
  }

  /**
   * 게시글 좋아요를 토글합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 좋아요 상태
   */
  static async toggleLike(postId, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [existing] = await connection.query(
        'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      if (existing.length > 0) {
        await connection.query(
          'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
          [postId, userId]
        );
      } else {
        await connection.query(
          'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
          [postId, userId]
        );
      }

      await connection.commit();
      return !existing.length;
    } catch (error) {
      await connection.rollback();
      console.error('좋아요 토글 에러:', error);
      throw new Error('좋아요 처리에 실패했습니다.');
    } finally {
      connection.release();
    }
  }

  /**
   * 사용자의 게시글 좋아요 여부를 확인합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 좋아요 여부
   */
  static async isLikedByUser(postId, userId) {
    try {
      const [rows] = await db.query(
        'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('좋아요 확인 에러:', error);
      throw new Error('좋아요 확인에 실패했습니다.');
    }
  }
}

module.exports = Post; 