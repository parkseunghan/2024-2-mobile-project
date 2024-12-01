const YoutubeService = require('../services/YoutubeService');
const SummaryService = require('../services/SummaryService');

exports.searchVideos = async (req, res) => {
    try {
        const { query, categoryId } = req.query;
        const videos = await YoutubeService.searchVideos(query, categoryId);
        res.json({ videos });
    } catch (error) {
        console.error('유튜브 검색 에러:', error);
        res.status(500).json({ message: '비디오 검색에 실패했습니다.' });
    }
};

exports.getVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params;
        console.log('Controller received videoId:', videoId);
        
        const video = await YoutubeService.getVideoDetails(videoId);
        console.log('Video details retrieved successfully');
        
        res.json({ 
            success: true,
            video 
        });
    } catch (error) {
        console.error('비디오 상세 정보 조회 에러:', error);
        res.status(error.response?.status || 500).json({ 
            success: false,
            message: error.message || '비디오 정보 조회에 실패했습니다.' 
        });
    }
};

exports.getRecommendedVideos = async (req, res) => {
    try {
        const videos = await YoutubeService.getRecommendedVideos();
        res.json({ videos });
    } catch (error) {
        console.error('추천 비디오 조회 에러:', error);
        res.status(500).json({ message: '추천 비디오 조회에 실패했습니다.' });
    }
};

exports.getCategoryVideos = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log('Received category request for:', categoryId);
        
        const videos = await YoutubeService.getCategoryVideos(categoryId);
        console.log('Found videos count:', videos.length);
        
        res.json({ videos });
    } catch (error) {
        console.error('카테고리 비디오 조회 에러:', error);
        res.status(error.response?.status || 500).json({ 
            message: error.message || '카테고리 비디오 조회에 실패했습니다.' 
        });
    }
};

exports.summarizeVideo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                error: '요약 기능은 회원만 이용할 수 있습니다.' 
            });
        }

        const { videoId, videoUrl } = req.body;
        
        // user 정보를 SummaryService로 전달
        const summary = await SummaryService.createSummary(videoId, req.user);
        
        res.json({
            summary: summary.content,
            creator: summary.creator,
            fromCache: summary.fromCache
        });
    } catch (error) {
        console.error('요약 생성 에러:', error);
        const errorMessage = error.message || '요약 생성에 실패했습니다.';
        res.status(500).json({ error: errorMessage });
    }
};

exports.getVideoSummary = async (req, res) => {
    try {
        const { videoId } = req.params;
        const summary = await SummaryService.getSummary(videoId);
        
        if (!summary) {
            return res.status(200).json({ 
                hasSummary: false,
                message: '요약을 찾을 수 없습니다.' 
            });
        }

        res.json({
            hasSummary: true,
            summary: summary.summary_text,
            creator: summary.creator_name,
            fromCache: true
        });
    } catch (error) {
        console.error('요약 조회 에러:', error);
        res.status(500).json({ error: '요약 조회에 실패했습니다.' });
    }
};


