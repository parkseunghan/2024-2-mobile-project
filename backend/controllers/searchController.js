const YoutubeService = require('../services/YoutubeService');
const Post = require('../models/Post');
const db = require('../config/database');

exports.search = async (req, res) => {
    try {
        const { query, type = 'all' } = req.query;
        const results = { videos: [], posts: [] };

        // YouTube 검색
        if (type === 'all' || type === 'video') {
            const videos = await YoutubeService.searchVideos(query);
            console.log('YouTube API Response:', videos); // 유튜브 API 응답 로깅
            results.videos = videos;
        }

        // 커뮤니티 게시글 검색
        if (type === 'all' || type === 'post') {
            results.posts = await Post.search(query);
        }

        console.log('Final Response:', results); // 최종 응답 로깅
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

        // 기존 검색어가 있는지 확인
        const [existingQuery] = await db.query(
            'SELECT id FROM search_history WHERE user_id = ? AND query = ?',
            [userId, query]
        );

        if (existingQuery.length > 0) {
            // 기존 검색어가 있으면 시간만 업데이트
            await db.query(
                'UPDATE search_history SET created_at = NOW() WHERE id = ?',
                [existingQuery[0].id]
            );
        } else {
            // 새로운 검색어 추가
            await db.query(
                'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
                [userId, query]
            );
        }

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