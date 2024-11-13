const db = require('../config/database');

class SearchHistory {
  static async add(userId, query) {
    await db.query(
      'DELETE FROM search_history WHERE user_id = ? AND query = ?',
      [userId, query]
    );

    const [countResult] = await db.query(
      'SELECT COUNT(DISTINCT query) as count FROM search_history WHERE user_id = ?',
      [userId]
    );

    if (countResult[0].count >= 10) {
      await db.query(`
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

    const [result] = await db.query(
      'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
      [userId, query]
    );
    return result.insertId;
  }

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
    return rows;
  }

  static async deleteByUserId(userId) {
    await db.query('DELETE FROM search_history WHERE user_id = ?', [userId]);
  }

  static async deleteQuery(userId, query) {
    await db.query(
      'DELETE FROM search_history WHERE user_id = ? AND query = ?',
      [userId, query]
    );
  }

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
    return rows;
  }

  static async getHourlySearchStats() {
    const [rows] = await db.query(`
      SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as search_count
      FROM search_history
      GROUP BY HOUR(created_at)
      ORDER BY hour
    `);
    return rows;
  }
}

module.exports = SearchHistory; 