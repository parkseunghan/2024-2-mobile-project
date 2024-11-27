const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/search', youtubeController.searchVideos);
router.get('/videos/:videoId', youtubeController.getVideoDetails);
router.get('/summary/:videoId', youtubeController.getVideoSummary);
router.post('/summarize', authenticateToken, youtubeController.summarizeVideo);
router.get('/summary/:requestId', authenticateToken, youtubeController.getSummaryResult);
router.post('/update-formats', authenticateToken, youtubeController.updateAllSummaryFormats);

module.exports = router; 