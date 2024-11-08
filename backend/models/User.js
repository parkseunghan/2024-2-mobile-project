const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(username, email, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = true', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ? AND is_active = true', [id]);
        return rows[0];
    }

    static async getAllUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await db.query(
            'SELECT id, username, email, role, created_at FROM users WHERE is_active = true LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async updateRole(userId, newRole) {
        const [result] = await db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [newRole, userId]
        );
        return result.affectedRows > 0;
    }

    static async deactivateUser(userId) {
        const [result] = await db.query(
            'UPDATE users SET is_active = false WHERE id = ?',
            [userId]
        );
        return result.affectedRows > 0;
    }

    static async query(sql, params = []) {
        const [rows] = await db.query(sql, params);
        return rows;
    }
}

module.exports = User;
