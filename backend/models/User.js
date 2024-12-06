const db = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * 사용자 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class User {
  /**
   * 사용자 생성
   * @param {Object} userData - 사용자 데이터
   * @param {string} userData.username - 사용자명
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @returns {Promise<Object>} 생성된 사용자 정보
   */
  static async create({ username, email, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
        `INSERT INTO users (username, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, role]
    );
    return { id: result.insertId, username, email, role };
  }

  /**
   * 이메일로 사용자 찾기
   * @param {string} email - 이메일
   * @returns {Promise<Object>} 사용자 정보
   */
  static async findByEmail(email) {
    try {
      const [users] = await db.query(
        `SELECT u.*, ur.name as rank_name, ur.color as rank_color
         FROM users u
         LEFT JOIN user_ranks ur ON u.current_rank_id = ur.id
         WHERE u.email = ? AND u.is_active = true`,
        [email]
      );
      return users[0];
    } catch (error) {
      console.error('사용자 조회 에러:', error);
      throw new Error('사용자 조회에 실패했습니다.');
    }
  }

  /**
   * 모밀번호 검증
   * @param {string} password - 입력된 비밀번호
   * @param {string} hashedPassword - 저장된 해시 비밀번호
   * @returns {Promise<boolean>} 검증 결과
   */
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * ID로 사용자 찾기
   * @param {number} id - 사용자 ID
   * @returns {Promise<Object>} 사용자 정보
   */
  static async findById(id) {
    try {
      const [users] = await db.query(
        `SELECT u.id, u.username, u.email, u.role, u.created_at,
                ur.name as rank_name, ur.color as rank_color,
                COALESCE(us.score, 0) as points
         FROM users u
         LEFT JOIN user_ranks ur ON u.current_rank_id = ur.id
         LEFT JOIN user_scores us ON u.id = us.user_id
         WHERE u.id = ?`,
        [id]
      );
      return users[0];
    } catch (error) {
      console.error('사용자 조회 에러:', error);
      throw new Error('사용자 조회에 실패했습니다.');
    }
  }

  /**
   * 랭킹 정보 가져오기
   * @returns {Promise<Array>} 랭킹 정보 배열
   */
  static async getRankings() {
    try {
      const [rows] = await db.query(`
        SELECT 
          u.id,
          u.username,
          u.created_at as join_date,
          ur.name as rank_name,
          ur.color as rank_color,
          us.score as total_score,
          COUNT(DISTINCT p.id) as total_posts,
          COUNT(DISTINCT c.id) as total_comments,
          COALESCE(SUM(p.view_count), 0) as total_views,
          COALESCE(
            (SELECT COUNT(*) 
             FROM post_likes pl 
             JOIN posts up ON pl.post_id = up.id 
             WHERE up.user_id = u.id), 
            0
          ) as total_likes
        FROM users u
        LEFT JOIN user_ranks ur ON u.current_rank_id = ur.id
        LEFT JOIN user_scores us ON u.id = us.user_id
        LEFT JOIN posts p ON u.id = p.user_id AND p.is_deleted = false
        LEFT JOIN comments c ON u.id = c.user_id AND c.is_deleted = false
        WHERE u.is_active = true
        GROUP BY u.id, u.username, u.created_at, ur.name, ur.color, us.score
        ORDER BY us.score DESC
        LIMIT 100
      `);
      return rows;
    } catch (error) {
      console.error('랭킹 조회 에러:', error);
      throw new Error('랭킹 정보를 불러오는데 실패했습니다.');
    }
  }
}

module.exports = User;
