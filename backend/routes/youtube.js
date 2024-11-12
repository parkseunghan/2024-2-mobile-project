const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/search', youtubeController.searchVideos);
router.get('/videos/:videoId', youtubeController.getVideoDetails);

module.exports = router; 