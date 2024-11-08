class StatisticsRepository {
  constructor(db) {
    this.db = db;
  }

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