const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

// 검색 기록 관련 라우트에만 인증 미들웨어 적용
router.post('/history', authMiddleware, searchController.addSearchHistory);
router.get('/history', authMiddleware, searchController.getSearchHistory);
router.delete('/history', authMiddleware, searchController.clearSearchHistory);
router.delete('/history/:query', authMiddleware, searchController.deleteSearchHistoryItem);

module.exports = router; 