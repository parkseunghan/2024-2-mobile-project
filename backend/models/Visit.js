const db = require('../config/database');

class Visit {
    static async countTodayVisits() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM visits WHERE created_at >= ?',
            [today]
        );
        return rows[0].count;
    }

    static async create(data) {
        const { userId, page, ipAddress, userAgent } = data;
        const [result] = await db.execute(
            'INSERT INTO visits (user_id, page, ip_address, user_agent) VALUES (?, ?, ?, ?)',
            [userId, page, ipAddress, userAgent]
        );
        return result.insertId;
    }
}

module.exports = Visit; 