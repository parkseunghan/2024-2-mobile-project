const db = require('../config/database');

/**
 * 댓글 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class Comment {
  /**
   * 새로운 댓글을 생성합니다.
   * @param {Object} commentData - 댓글 데이터
   * @param {number} commentData.postId - 게시글 ID
   * @param {number} commentData.userId - 작성자 ID
   * @param {string} commentData.content - 댓글 내용
   * @returns {Promise<Object>} 생성된 댓글 정보
   */
  static async create({ postId, userId, content }) {
    try {
      console.log('Creating comment:', { postId, userId, content });
      
      if (!content?.trim()) {
        throw new Error('댓글 내용은 필수입니다.');
      }

      const [result] = await db.query(
        `INSERT INTO comments (post_id, user_id, content, created_at)
         VALUES (?, ?, ?, NOW())`,
        [postId, userId, content]
      );

      const [comment] = await db.query(
        `SELECT c.*, u.username as author_name
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [result.insertId]
      );

      return comment[0];
    } catch (error) {
      console.error('댓글 생성 에러:', error);
      throw error;
    }
  }

  /**
   * 게시글의 모든 댓글을 조회합니다.
   * @param {number} postId - 게시글 ID
   * @returns {Promise<Array>} 댓글 목록
   */
  static async findByPostId(postId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          u.username as author_name,
          u.rank as author_rank,
          r.color as rank_color,
          r.name as rank_name
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN ranks r ON u.rank = r.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `, [postId]);
      return rows;
    } catch (error) {
      console.error('댓글 조회 에러:', error);
      throw new Error('댓글 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 댓글을 수정합니다.
   * @param {number} commentId - 댓글 ID
   * @param {number} userId - 작성자 ID
   * @param {string} content - 수정할 내용
   * @returns {Promise<boolean>} 수정 성공 여부
   */
  static async update(commentId, userId, content) {
    try {
      const [result] = await db.query(
        'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
        [content, commentId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      throw new Error('댓글 수정에 실패했습니다.');
    }
  }

  /**
   * 댓글을 삭제합니다.
   * @param {number} commentId - 댓글 ID
   * @param {number} userId - 작성자 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  static async delete(commentId, userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM comments WHERE id = ? AND user_id = ?',
        [commentId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('댓글 삭제 에러:', error);
      throw new Error('댓글 삭제에 실패했습니다.');
    }
  }

  /**
   * 사용자가 작성한 모든 댓글을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 댓글 목록
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          p.title as post_title,
          u.username as author_name
        FROM comments c
        LEFT JOIN posts p ON c.post_id = p.id
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.user_id = ? AND p.is_deleted = false
        ORDER BY c.created_at DESC
      `, [userId]);
      return rows;
    } catch (error) {
      console.error('사용자 댓글 조회 에러:', error);
      throw new Error('댓글 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 게시글의 댓글 수를 조회합니다.
   * @param {number} postId - 게시글 ID
   * @returns {Promise<number>} 댓글 수
   */
  static async getCommentCount(postId) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
        [postId]
      );
      return rows[0].count;
    } catch (error) {
      console.error('댓글 수 조회 에러:', error);
      throw new Error('댓글 수 조회에 실패했습니다.');
    }
  }
}

module.exports = Comment; 