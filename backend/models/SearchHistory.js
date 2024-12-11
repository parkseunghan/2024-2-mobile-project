const db = require('../config/database'); // 데이터베이스 설정을 불러옴.

/**
 * 검색 기록 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class SearchHistory {
  /**
   * 검색 기록을 추가합니다.
   * @param {number} userId - 사용자 ID
   * @param {string} query - 검색어
   * @returns {Promise<number>} 생성된 검색 기록의 ID
   */
  static async add(userId, query) {
    const connection = await db.getConnection(); // 데이터베이스 연결 가져오기
    try {
      await connection.beginTransaction(); // 트랜잭션 시작

      // 동일한 검색어가 있다면 삭제
      await connection.query(
        'DELETE FROM search_history WHERE user_id = ? AND query = ?',
        [userId, query]
      );

      // 검색어 개수 확인
      const [countResult] = await connection.query(
        'SELECT COUNT(DISTINCT query) as count FROM search_history WHERE user_id = ?',
        [userId]
      );

      // 최대 10개까지만 저장하도록 관리
      if (countResult[0].count >= 10) {
        await connection.query(`
          DELETE FROM search_history 
          WHERE user_id = ? 
          AND created_at = (
            SELECT created_at 
            FROM (
              SELECT MIN(created_at) as created_at 
              FROM search_history 
              WHERE user_id = ?
            ) as oldest
          )`,
          [userId, userId]
        );
      }

      // 새로운 검색어 추가
      const [result] = await connection.query(
        'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
        [userId, query]
      );

      await connection.commit(); // 트랜잭션 커밋
      return result.insertId; // 생성된 검색 기록의 ID 반환

    } catch (error) {
      await connection.rollback(); // 에러 발생 시 트랜잭션 롤백
      throw error; // 에러 발생
    } finally {
      connection.release(); // 데이터베이스 연결 해제
    }
  }

  /**
   * 사용자의 검색 기록을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 검색 기록 목록
   */
  static async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT DISTINCT query, MAX(created_at) as created_at 
       FROM search_history 
       WHERE user_id = ? 
       GROUP BY query 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );
    return rows; // 검색 기록 목록 반환
  }

  /**
   * 사용자의 모든 검색 기록을 삭제합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<void>}
   */
  static async deleteByUserId(userId) {
    await db.query('DELETE FROM search_history WHERE user_id = ?', [userId]); // 검색 기록 삭제
  }

  /**
   * 특정 검색어를 삭제합니다.
   * @param {number} userId - 사용자 ID
   * @param {string} query - 삭제할 검색어
   * @returns {Promise<void>}
   */
  static async deleteQuery(userId, query) {
    await db.query(
      'DELETE FROM search_history WHERE user_id = ? AND query = ?',
      [userId, query] // 특정 검색어 삭제
    );
  }

  /**
   * 검색 통계를 조회합니다.
   * @returns {Promise<Array>} 검색 통계 정보
   */
  static async getSearchStats() {
    const [rows] = await db.query(`
      SELECT 
        query,
        COUNT(*) as search_count,
        DATE(created_at) as search_date
      FROM search_history
      GROUP BY query, DATE(created_at)
      ORDER BY search_count DESC, search_date DESC
      LIMIT 10
    `);
    return rows; // 검색 통계 정보 반환
  }

  /**
   * 시간대별 검색 통계를 조회합니다.
   * @returns {Promise<Array>} 시간대별 검색 통계
   */
  static async getHourlySearchStats() {
    const [rows] = await db.query(`
      SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as search_count
      FROM search_history
      GROUP BY HOUR(created_at)
      ORDER BY hour
    `);
    return rows; // 시간대별 검색 통계 반환
  }
}

module.exports = SearchHistory; // SearchHistory 모델을 내보냄.
