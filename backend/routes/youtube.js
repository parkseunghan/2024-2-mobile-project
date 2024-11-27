const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/search', youtubeController.searchVideos);
router.get('/videos/:videoId', youtubeController.getVideoDetails);
router.get('/videos/:videoId/summary', youtubeController.getSummary);

module.exports = router; 