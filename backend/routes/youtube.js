const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/search', youtubeController.searchVideos);
router.get('/videos/:videoId', youtubeController.getVideoDetails);
router.post('/summarize', youtubeController.summarizeVideo);
router.get('/summary/:requestId', youtubeController.getSummaryResult);

module.exports = router; 