const YoutubeService = require('../services/YoutubeService');
const Post = require('../models/Post');
const db = require('../config/database');

exports.search = async (req, res) => {
    try {
        const { query, type = 'all' } = req.query;
        const results = { videos: [], posts: [] };

        // YouTube 검색
        if (type === 'all' || type === 'video') {
            results.videos = await YoutubeService.searchVideos(query);
        }

        // 커뮤니티 게시글 검색
        if (type === 'all' || type === 'post') {
            results.posts = await Post.search(query);
        }

        res.json(results);
    } catch (error) {
        console.error('통합 검색 에러:', error);
        res.status(500).json({ message: '검색에 실패했습니다.' });
    }
};

exports.searchByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { query } = req.query;

        const videos = await YoutubeService.searchVideos(query, categoryId);
        res.json({ videos });
    } catch (error) {
        console.error('카테고리 검색 에러:', error);
        res.status(500).json({ message: '카테고리 검색에 실패했습니다.' });
    }
};

exports.getSearchHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const [history] = await db.query(
            `SELECT query, created_at 
             FROM search_history 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [userId]
        );
        
        res.json({ history });
    } catch (error) {
        console.error('검색 기록 조회 에러:', error);
        res.status(500).json({ message: '검색 기록 조회에 실패했습니다.' });
    }
};

exports.addSearchHistory = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user.id;

        await db.query(
            'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
            [userId, query]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('검색 기록 저장 에러:', error);
        res.status(500).json({ message: '검색 기록 저장에 실패했습니다.' });
    }
};

exports.clearSearchHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.query(
            'DELETE FROM search_history WHERE user_id = ?',
            [userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('검색 기록 전체 삭제 에러:', error);
        res.status(500).json({ message: '검색 기록 삭제에 실패했습니다.' });
    }
};

exports.deleteSearchHistoryItem = async (req, res) => {
    try {
        const { query } = req.params;
        const userId = req.user.id;

        await db.query(
            'DELETE FROM search_history WHERE user_id = ? AND query = ?',
            [userId, query]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('검색 기록 항목 삭제 에러:', error);
        res.status(500).json({ message: '검색 기록 항목 삭제에 실패했습니다.' });
    }
}; 