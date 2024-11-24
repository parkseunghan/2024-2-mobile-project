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

    static async updateProfile(userId, updateData) {
        try {
            const [result] = await db.query(
                'UPDATE users SET ? WHERE id = ?',
                [updateData, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('프로필 업데이트 에러:', error);
            return false;
        }
    }

    static async findByUsername(username) {
        const [rows] = await db.query(
            'SELECT id, username, email, role FROM users WHERE username = ? AND is_active = true',
            [username]
        );
        return rows[0];
    }
}

module.exports = User;
