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
}

module.exports = User;
