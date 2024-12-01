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
  static async create(userData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // 사용자 생성
      const [userResult] = await connection.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword]
      );

      // Bronze 등급 ID 조회
      const [bronzeRank] = await connection.query(
        'SELECT id FROM user_ranks WHERE name = ?',
        ['Bronze']
      );

      // 기본 등급 설정
      if (bronzeRank.length > 0) {
        await connection.query(
          'UPDATE users SET current_rank_id = ? WHERE id = ?',
          [bronzeRank[0].id, userResult.insertId]
        );
      }

      // 사용자 점수 테이블 초기화
      await connection.query(
        `INSERT INTO user_scores (user_id, score, total_posts, total_likes_received, total_comments) 
         VALUES (?, 0, 0, 0, 0)`,
        [userResult.insertId]
      );

      // 생성된 사용자 정보 조회
      const [users] = await connection.query(
        `SELECT u.id, u.username, u.email, u.role, u.created_at,
                ur.name as rank_name, ur.color as rank_color,
                COALESCE(us.score, 0) as points
         FROM users u
         LEFT JOIN user_ranks ur ON u.current_rank_id = ur.id
         LEFT JOIN user_scores us ON u.id = us.user_id
         WHERE u.id = ?`,
        [userResult.insertId]
      );

      await connection.commit();
      return users[0];

    } catch (error) {
      await connection.rollback();
      console.error('사용자 생성 에러:', error);
      throw new Error('사용자 생성에 실패했습니다.');
    } finally {
      connection.release();
    }
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
   * 테스트 계정 생성
   */
  static async createTestAccounts() {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // god 계정 비밀번호 해시
      const godPassword = await bcrypt.hash('god', 10);
      // admin 계정 비밀번호 해시
      const adminPassword = await bcrypt.hash('admin', 10);
      // user 계정 비밀번호 해시
      const userPassword = await bcrypt.hash('user', 10);

      // 기존 테스트 계정 삭제
      await connection.query(
        'DELETE FROM users WHERE email IN (?, ?, ?)',
        ['god', 'admin', 'user']
      );

      // 테스트 계정 생성
      const [godResult] = await connection.query(
        `INSERT INTO users (username, email, password, role, current_rank_id)
         VALUES (?, ?, ?, ?, (SELECT id FROM user_ranks WHERE name = ?))`,
        ['God Admin', 'god', godPassword, 'god', 'Diamond']
      );

      const [adminResult] = await connection.query(
        `INSERT INTO users (username, email, password, role, current_rank_id)
         VALUES (?, ?, ?, ?, (SELECT id FROM user_ranks WHERE name = ?))`,
        ['Test Admin', 'admin', adminPassword, 'admin', 'Platinum']
      );

      const [userResult] = await connection.query(
        `INSERT INTO users (username, email, password, role, current_rank_id)
         VALUES (?, ?, ?, ?, (SELECT id FROM user_ranks WHERE name = ?))`,
        ['Test User', 'user', userPassword, 'user', 'Bronze']
      );

      // 점수 초기화
      await connection.query(
        `INSERT INTO user_scores (user_id, score)
         VALUES 
         (?, 5000),
         (?, 1000),
         (?, 0)`,
        [godResult.insertId, adminResult.insertId, userResult.insertId]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('테스트 계정 생성 에러:', error);
      throw error;
    } finally {
      connection.release();
    }
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
