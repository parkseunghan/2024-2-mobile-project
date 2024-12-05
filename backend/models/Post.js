const db = require('../config/database');

/**
 * 게시글 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class Post {
  /**
   * 새로운 게시글을 생성합니다.
   * @param {Object} postData - 게시글 데이터
   * @param {string} postData.title - 제목
   * @param {string} postData.content - 내용
   * @param {number} postData.userId - 작성자 ID
   * @param {string} postData.category - 카테고리
   * @param {string} postData.media_url - 미디어 URL
   * @param {Array} postData.poll_options - 투표 옵션 목록
   * @returns {Promise<Object>} 생성된 게시글 정보
   */
  static async create({ title, content, userId, category = 'general', media_url = null, poll_options = null }) {
    if (!title?.trim() || !content?.trim() || !userId || !category?.trim()) {
        throw new Error('필수 입력값이 누락되었습니다.');
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // 게시글 생성
        const [result] = await connection.execute(
            `INSERT INTO posts (title, content, user_id, category, media_url, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [title, content, userId, category, media_url]
        );
        
        const postId = result.insertId;
        
        // 투표 옵션이 있는 경우 추가
        if (poll_options && poll_options.length > 0) {
            const pollValues = poll_options.map(option => 
                [postId, option.text, 0] // votes는 초기값 0
            );
            
            await connection.query(
                `INSERT INTO poll_options (post_id, text, votes) VALUES ?`,
                [pollValues]
            );
        }
        
        await connection.commit();
        
        return {
            id: postId,
            title,
            content,
            userId,
            category,
            media_url,
            poll_options: poll_options || [],
            created_at: new Date(),
            updated_at: new Date()
        };
        
    } catch (error) {
        await connection.rollback();
        console.error('게시글 생성 에러:', error);
        throw error;
    } finally {
        connection.release();
    }
  }

  /**
   * ID로 게시글을 조회합니다.
   * @param {number} postId - 게시글 ID
   * @returns {Promise<Object|null>} 게시글 정보
   */
  static async findById(postId) {
    try {
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
    } catch (error) {
      console.error('게시글 조회 에러:', error);
      throw new Error('게시글 조회에 실패했습니다.');
    }
  }

  /**
   * 게시글 목록을 조회합니다.
   * @param {string|null} category - 카테고리
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 항목 수
   * @returns {Promise<Array>} 게시글 목록
   */
  static async findAll(category = null, page = 1, limit = 10, userId = null) {
    try {
        const offset = (page - 1) * limit;
        let query = `
            SELECT 
                p.*,
                u.username as author_name,
                u.avatar as author_avatar,
                ur.name as author_rank,
                ur.color as author_rank_color,
                COUNT(DISTINCT pl.id) as like_count,
                COUNT(DISTINCT c.id) as comment_count,
                ${userId ? 'EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) as is_liked,' : ''}
                GROUP_CONCAT(DISTINCT c.id) as comment_ids
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN user_ranks ur ON u.current_rank_id = ur.id
            LEFT JOIN post_likes pl ON p.id = pl.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.is_deleted = false
            ${category ? 'AND p.category = ?' : ''}
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const params = userId 
            ? [userId, ...(category ? [category] : []), limit, offset]
            : [...(category ? [category] : []), limit, offset];

        const [posts] = await db.query(query, params);

        // 댓글 정보 추가
        for (let post of posts) {
            if (post.comment_ids) {
                const [comments] = await db.query(`
                    SELECT c.*, u.username as author_name
                    FROM comments c
                    LEFT JOIN users u ON c.user_id = u.id
                    WHERE c.id IN (?)
                `, [post.comment_ids.split(',')]);
                post.comments = comments;
            } else {
                post.comments = [];
            }
            delete post.comment_ids;
        }

        return posts;
    } catch (error) {
        console.error('게시글 목록 조회 에러:', error);
        throw new Error('게시글 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 사용자가 작성한 게시글을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 게시글 목록
   */
  static async findByUserId(userId) {
    try {
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
    } catch (error) {
      console.error('사용자 게시글 조회 에러:', error);
      throw new Error('게시글 조회에 실패했습니다.');
    }
  }

  /**
   * 사용자가 좋아요한 게시글을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 게시글 목록
   */
  static async findLikedByUserId(userId) {
    try {
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
    } catch (error) {
      console.error('좋아요 게시글 조회 에러:', error);
      throw new Error('게시글 조회에 실패했습니다.');
    }
  }

  /**
   * 게시글을 수정합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 작성자 ID
   * @param {Object} updateData - 수정할 데이터
   * @returns {Promise<boolean>} ���정 성공 여부
   */
  static async update(postId, userId, { title, content, mediaUrl }) {
    try {
      const [result] = await db.query(
        'UPDATE posts SET title = ?, content = ?, media_url = ? WHERE id = ? AND user_id = ? AND is_deleted = false',
        [title, content, mediaUrl, postId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('게시글 수정 에러:', error);
      throw new Error('게시글 수정에 패했습니다.');
    }
  }

  /**
   * 게시글을 삭제합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 작성자 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  static async delete(postId, userId) {
    try {
      const [result] = await db.query(
        'UPDATE posts SET is_deleted = true WHERE id = ? AND user_id = ?',
        [postId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
      throw new Error('게시글 삭제에 실패했습니다.');
    }
  }

  /**
   * 게시글 좋아요를 토글합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 좋아요 상태
   */
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
      console.error('좋아요 토글 에러:', error);
      throw new Error('좋아요 처리에 실패했습니다.');
    } finally {
      connection.release();
    }
  }

  /**
   * 사용자의 게시글 좋아요 여부를 확인합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 좋아요 여부
   */
  static async isLikedByUser(postId, userId) {
    try {
      const [rows] = await db.query(
        'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('좋아요 확인 에러:', error);
      throw new Error('좋아요 확인에 실패했습니다.');
    }
  }

  /**
   * 게시글 조회수를 증가시킵니다.
   * @param {number} postId - 게시글 ID
   */
  static async incrementViewCount(postId) {
    try {
      await db.query(
        'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
        [postId]
      );
    } catch (error) {
      console.error('조회수 가 에러:', error);
    }
  }

  /**
   * 게시글 북마크를 토글합니다.
   * @param {number} postId - 게시글 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 북마크 상태
   */
  static async toggleBookmark(postId, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [existing] = await connection.query(
        'SELECT id FROM post_bookmarks WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      if (existing.length > 0) {
        await connection.query(
          'DELETE FROM post_bookmarks WHERE post_id = ? AND user_id = ?',
          [postId, userId]
        );
      } else {
        await connection.query(
          'INSERT INTO post_bookmarks (post_id, user_id) VALUES (?, ?)',
          [postId, userId]
        );
      }

      await connection.commit();
      return !existing.length;
    } catch (error) {
      await connection.rollback();
      console.error('북마크 토글 에러:', error);
      throw new Error('북마크 처리에 실패했습니다.');
    } finally {
      connection.release();
    }
  }
}

module.exports = Post; 