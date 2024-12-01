const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const authMiddleware = require('../middleware/authMiddleware');

// 인증이 필요한 라우트
router.post('/summarize', authMiddleware, youtubeController.summarizeVideo);

// 인증이 필요하지 않은 라우트
router.get('/category/:categoryId', youtubeController.getCategoryVideos);
router.get('/videos/:videoId', youtubeController.getVideoDetails);
router.get('/search', youtubeController.searchVideos);
router.get('/summary/:videoId', youtubeController.getVideoSummary);

module.exports = router; 