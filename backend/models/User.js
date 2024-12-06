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
                COALESCE(us.total_score, 0) as points
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
      const [rankings] = await db.query(`
        SELECT 
          u.id,
          u.username,
          ur.name as rank_name,
          ur.color as rank_color,
          COALESCE(us.total_score, 0) as total_score,
          COALESCE(us.total_posts, 0) as total_posts,
          COALESCE(us.total_comments, 0) as total_comments,
          COALESCE(us.total_received_likes, 0) as total_received_likes,
          COALESCE(us.total_received_comments, 0) as total_received_comments,
          COALESCE(us.total_views, 0) as total_views
        FROM users u
        LEFT JOIN user_ranks ur ON u.current_rank_id = ur.id
        LEFT JOIN user_scores us ON u.id = us.user_id
        WHERE u.is_active = true
        ORDER BY us.total_score DESC, u.created_at ASC
      `);

      console.log('[User.getRankings] 조회된 랭킹 데이터:', rankings.length);
      return rankings;
    } catch (error) {
      console.error('[User.getRankings] 랭킹 조회 에러:', error);
      throw error;
    }
  }

  /**
   * 사용자의 조회수 점수를 계산합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<number>} 총 조회수 점수
   */
  static async calculateViewScore(userId) {
    try {
      const [settings] = await db.query(
        'SELECT points, max_points_per_item FROM score_settings WHERE activity_type = ?',
        ['view_count']
      );
      
      if (!settings[0]) return 0;
      
      const { points, max_points_per_item } = settings[0];
      
      // 각 게시물별로 제한된 조회수 점수를 계산
      const [rows] = await db.query(`
        SELECT 
          LEAST(view_count * ?, ?) as post_view_score
        FROM posts 
        WHERE user_id = ? AND is_deleted = false
      `, [points, max_points_per_item, userId]);

      // 모든 게시물의 조회수 점수 합계 계산
      const totalViewScore = rows.reduce((sum, row) => sum + row.post_view_score, 0);
      
      return totalViewScore;
    } catch (error) {
      console.error('조회수 점수 계산 에러:', error);
      return 0;
    }
  }

  /**
   * 사용자의 점수를 업데이트합니다.
   * @param {number} userId - 사용자 ID
   */
  static async updateUserScore(userId) {
    try {
      // 각 활동별 점수 설정 조회
      const [settings] = await db.query('SELECT * FROM score_settings');
      const scoreConfig = settings.reduce((acc, setting) => {
        acc[setting.activity_type] = {
          points: setting.points,
          max_points_per_item: setting.max_points_per_item
        };
        return acc;
      }, {});

      // 게시글, 댓글, 좋아요, 댓글 수 조회
      const [userStats] = await db.query(`
        SELECT 
          COUNT(DISTINCT p.id) as total_posts,
          COUNT(DISTINCT c.id) as total_comments,
          (SELECT COUNT(*) FROM post_likes pl JOIN posts up ON pl.post_id = up.id WHERE up.user_id = ?) as total_received_likes,
          (SELECT COUNT(*) FROM comments rc WHERE rc.post_id IN (SELECT id FROM posts WHERE user_id = ?)) as total_received_comments
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id AND p.is_deleted = false
        LEFT JOIN comments c ON u.id = c.user_id AND c.is_deleted = false
        WHERE u.id = ?
      `, [userId, userId, userId]);

      const stats = userStats[0];
      
      // 조회수 점수 계산
      const viewScore = await this.calculateViewScore(userId);

      // 각 항목별 점수 계산
      const postScore = stats.total_posts * scoreConfig.post_creation.points;
      const commentScore = stats.total_comments * scoreConfig.comment_creation.points;
      const receivedLikeScore = stats.total_received_likes * scoreConfig.received_like.points;
      const receivedCommentScore = stats.total_received_comments * scoreConfig.received_comment.points;

      // 총점 계산
      const totalScore = postScore + commentScore + receivedLikeScore + receivedCommentScore + viewScore;

      // 점수 정보 업데이트
      await db.query(`
        INSERT INTO user_scores (
          user_id, total_score, post_score, comment_score, 
          received_like_score, received_comment_score, view_score,
          total_posts, total_comments, total_received_likes, 
          total_received_comments, total_views
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          total_score = VALUES(total_score),
          post_score = VALUES(post_score),
          comment_score = VALUES(comment_score),
          received_like_score = VALUES(received_like_score),
          received_comment_score = VALUES(received_comment_score),
          view_score = VALUES(view_score),
          total_posts = VALUES(total_posts),
          total_comments = VALUES(total_comments),
          total_received_likes = VALUES(total_received_likes),
          total_received_comments = VALUES(total_received_comments),
          total_views = VALUES(total_views)
      `, [
        userId, totalScore, postScore, commentScore,
        receivedLikeScore, receivedCommentScore, viewScore,
        stats.total_posts, stats.total_comments, stats.total_received_likes,
        stats.total_received_comments, viewScore / scoreConfig.view_count.points
      ]);

      // 등급 업데이트
      await this.updateUserRank(userId, totalScore);

    } catch (error) {
      console.error('사용자 점수 업데이트 에러:', error);
      throw new Error('점수 업데이트에 실패했습니다.');
    }
  }

  static async getAllUsers(page = 1, limit = 20, search = '') {
    try {
        const offset = (page - 1) * limit;
        let query = `
            SELECT 
                id, 
                username, 
                email, 
                role, 
                is_active as status, 
                created_at,
                current_rank_id as user_rank
            FROM users
            WHERE is_active = true
        `;

        const params = [];
        
        if (search) {
            query += ` AND (username LIKE ? OR email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [users] = await db.query(query, params);
        return users;
    } catch (error) {
        console.error('사용자 목록 조회 에러:', error);
        throw error;
    }
  }

  static async findByIdAndUpdate(id, updates) {
    try {
      const [result] = await db.query(
        'UPDATE users SET ? WHERE id = ?',
        [updates, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('사용자 업데이트 에러:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE users SET is_active = ? WHERE id = ?',
        [status === 'active', id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('사용자 상태 업데이트 에러:', error);
      throw error;
    }
  }

  static async updateRole(id, role) {
    try {
      if (!['user', 'admin'].includes(role)) {
        throw new Error('유효하지 않은 역할입니다.');
      }
      
      const [result] = await db.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('사용자 역할 업데이트 에러:', error);
      throw error;
    }
  }
}

module.exports = User;
