const db = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * 사용자 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class User {
  /**
   * 새로운 사용자를 생성합니다.
   * @param {string} username - 사용자명
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   * @param {string} role - 사용자 역할 (기본값: 'user')
   * @returns {Promise<number>} 생성된 사용자의 ID
   */
  static async create(username, email, password, role = 'user') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
      );
      return result.insertId;
    } catch (error) {
      console.error('사용자 생성 에러:', error);
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  /**
   * 이메일로 사용자를 조회합니다.
   * @param {string} email - 이메일
   * @returns {Promise<Object|null>} 사용자 정보
   */
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ? AND is_active = true',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('이메일 조회 에러:', error);
      throw new Error('사용자 조회에 실패했습니다.');
    }
  }

  /**
   * ID로 사용자를 조회합니다.
   * @param {number} id - 사용자 ID
   * @returns {Promise<Object|null>} 사용자 정보
   */
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ? AND is_active = true',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 에러:', error);
      throw new Error('사용자 조회에 실패했습니다.');
    }
  }

  /**
   * 모든 사용자 목록을 조회합니다.
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 항목 수
   * @returns {Promise<Array>} 사용자 목록
   */
  static async getAllUsers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await db.query(
        'SELECT id, username, email, role, created_at FROM users WHERE is_active = true LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      console.error('사용자 목록 조회 에러:', error);
      throw new Error('사용자 목록 조회에 실패했습니다.');
    }
  }

  /**
   * 사용자의 역할을 업데이트합니다.
   * @param {number} userId - 사용자 ID
   * @param {string} newRole - 새로운 역할
   * @returns {Promise<boolean>} 업데이트 성공 여부
   */
  static async updateRole(userId, newRole) {
    try {
      const [result] = await db.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [newRole, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('역할 업데이트 에러:', error);
      throw new Error('역할 업데이트에 실패했습니다.');
    }
  }

  /**
   * 사용자를 비활성화합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 비활성화 성공 여부
   */
  static async deactivateUser(userId) {
    try {
      const [result] = await db.query(
        'UPDATE users SET is_active = false WHERE id = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('사용자 비활성화 에러:', error);
      throw new Error('사용자 비활성화에 실패했습니다.');
    }
  }

  /**
   * 사용자 프로필을 업데이트합니다.
   * @param {number} userId - 사용자 ID
   * @param {Object} updateData - 업데이트할 데이터
   * @returns {Promise<boolean>} 업데이트 성공 여부
   */
  static async updateProfile(userId, updateData) {
    try {
      const [result] = await db.query(
        'UPDATE users SET ? WHERE id = ?',
        [updateData, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
      throw new Error('프로필 업데이트에 실패했습니다.');
    }
  }

  /**
   * 사용자명으로 사용자를 조회합니다.
   * @param {string} username - 사용자명
   * @returns {Promise<Object|null>} 사용자 정보
   */
  static async findByUsername(username) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role FROM users WHERE username = ? AND is_active = true',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('사용자명 조회 에러:', error);
      throw new Error('사용자 조회에 실패했습니다.');
    }
  }
}

module.exports = User;
