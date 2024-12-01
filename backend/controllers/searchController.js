const YoutubeService = require('../services/YoutubeService');
const Post = require('../models/Post');

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