/**
 * 통계 관련 데이터베이스 작업을 처리하는 Repository 클래스
 */
class StatisticsRepository {
  /**
   * StatisticsRepository 생성자
   * @param {Object} db - 데이터베이스 연결 객체
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * 기본 통계 정보를 조회합니다.
   * - 전체 사용자 수
   * - 오늘 새로 가입한 사용자 수
   * - 활성 사용자 수
   * @returns {Promise<Object>} 기본 통계 정보
   */
  async getBasicStats() {
    const [rows] = await this.db.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as new_users_today,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_users
      FROM users
    `);
    return rows[0];
  }

  /**
   * 사용자 증가 통계를 조회합니다.
   * @param {number} days - 조회할 기간(일)
   * @returns {Promise<Array>} 일별 신규 사용자 수
   */
  async getGrowthStats(days = 30) {
    const [rows] = await this.db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [days]);
    return rows;
  }

  /**
   * 사용자 역할별 분포를 조회합니다.
   * @returns {Promise<Array>} 역할별 사용자 수
   */
  async getRoleDistribution() {
    const [rows] = await this.db.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users 
      WHERE is_active = true
      GROUP BY role
    `);
    return rows;
  }

  /**
   * 활성/비활성 사용자 통계를 조회합니다.
   * @returns {Promise<Array>} 활성 상태별 사용자 수
   */
  async getActivityStats() {
    const [rows] = await this.db.query(`
      SELECT 
        is_active,
        COUNT(*) as count
      FROM users 
      GROUP BY is_active
    `);
    return rows;
  }

  /**
   * 시간대별 회원가입 통계를 조회합니다.
   * @param {number} days - 조회할 기간(일)
   * @returns {Promise<Array>} 시간대별 가입자 수
   */
  async getHourlySignups(days = 7) {
    const [rows] = await this.db.query(`
      SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY HOUR(created_at)
      ORDER BY hour
    `, [days]);
    return rows;
  }
}

module.exports = StatisticsRepository; 