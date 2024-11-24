const db = require('../config/database');

class Comment {
    static async create(postId, userId, content) {
        const [result] = await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, userId, content]
        );
        return result.insertId;
    }

    static async findByPostId(postId) {
        const [rows] = await db.query(`
            SELECT c.*, u.username as author_name
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `, [postId]);
        return rows;
    }

    static async update(commentId, userId, content) {
        const [result] = await db.query(
            'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
            [content, commentId, userId]
        );
        return result.affectedRows > 0;
    }

    static async delete(commentId, userId) {
        const [result] = await db.query(
            'DELETE FROM comments WHERE id = ? AND user_id = ?',
            [commentId, userId]
        );
        return result.affectedRows > 0;
    }

    static async findByUserId(userId) {
        const [rows] = await db.query(`
            SELECT 
                c.*,
                p.title as post_title,
                u.username as author_name
            FROM comments c
            LEFT JOIN posts p ON c.post_id = p.id
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.user_id = ? AND p.is_deleted = false
            ORDER BY c.created_at DESC
        `, [userId]);
        return rows;
    }
}

module.exports = Comment; 