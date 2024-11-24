const db = require('../config/database');

class Post {
    static async create(userId, { title, content, category, mediaUrl }) {
        try {
            console.log('Creating post in database:', {
                userId,
                title,
                content,
                category,
                mediaUrl
            });

            const [result] = await db.query(
                `INSERT INTO posts 
                (user_id, title, content, category, media_url) 
                VALUES (?, ?, ?, ?, ?)`,
                [userId, title, content, category, mediaUrl]
            );

            console.log('Post created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Post creation error:', error);
            throw error;
        }
    }

    static async findById(postId) {
        const [rows] = await db.query(`
            SELECT p.*, 
                   u.username as author_name,
                   COUNT(DISTINCT pl.id) as like_count,
                   COUNT(DISTINCT c.id) as comment_count
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN post_likes pl ON p.id = pl.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.id = ? AND p.is_deleted = false
            GROUP BY p.id
        `, [postId]);
        return rows[0];
    }

    static async findAll(category = null, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            let query = `
                SELECT p.*, 
                       u.username as author_name,
                       COUNT(DISTINCT pl.id) as like_count,
                       COUNT(DISTINCT c.id) as comment_count
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.id
                LEFT JOIN post_likes pl ON p.id = pl.post_id
                LEFT JOIN comments c ON p.id = c.post_id
                WHERE p.is_deleted = false
            `;
            
            const params = [];
            if (category) {
                query += ' AND p.category = ?';
                params.push(category);
            }
            
            query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            console.error('Post.findAll error:', error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        const [rows] = await db.query(`
            SELECT p.*, 
                   u.username as author_name,
                   COUNT(DISTINCT pl.id) as like_count,
                   COUNT(DISTINCT c.id) as comment_count
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN post_likes pl ON p.id = pl.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.user_id = ? AND p.is_deleted = false
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `, [userId]);
        return rows;
    }

    static async findLikedByUserId(userId) {
        const [rows] = await db.query(`
            SELECT p.*, 
                   u.username as author_name,
                   COUNT(DISTINCT pl2.id) as like_count,
                   COUNT(DISTINCT c.id) as comment_count
            FROM posts p
            INNER JOIN post_likes pl ON p.id = pl.post_id
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN post_likes pl2 ON p.id = pl2.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE pl.user_id = ? AND p.is_deleted = false
            GROUP BY p.id
            ORDER BY pl.created_at DESC
        `, [userId]);
        return rows;
    }

    static async update(postId, userId, { title, content, mediaUrl }) {
        const [result] = await db.query(
            'UPDATE posts SET title = ?, content = ?, media_url = ? WHERE id = ? AND user_id = ? AND is_deleted = false',
            [title, content, mediaUrl, postId, userId]
        );
        return result.affectedRows > 0;
    }

    static async delete(postId, userId) {
        const [result] = await db.query(
            'UPDATE posts SET is_deleted = true WHERE id = ? AND user_id = ?',
            [postId, userId]
        );
        return result.affectedRows > 0;
    }

    static async toggleLike(postId, userId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [existing] = await connection.query(
                'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
                [postId, userId]
            );

            if (existing.length > 0) {
                await connection.query(
                    'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
                    [postId, userId]
                );
            } else {
                await connection.query(
                    'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
                    [postId, userId]
                );
            }

            await connection.commit();
            return !existing.length;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async isLikedByUser(postId, userId) {
        const [rows] = await db.query(
            'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );
        return rows.length > 0;
    }
}

module.exports = Post; 