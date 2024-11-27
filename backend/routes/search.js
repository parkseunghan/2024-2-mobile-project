const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

// 검색 기록 저장
router.post('/history', authenticateToken, searchController.addSearchHistory);

// 검색 기록 조회
router.get('/history', authenticateToken, searchController.getSearchHistory);

// 특정 검색어 삭제
router.delete('/history/:query', authenticateToken, searchController.deleteSearchQuery);

// 전체 검색 기록 삭제
router.delete('/history', authenticateToken, searchController.clearSearchHistory);

// 검색 통계 조회 (관리자용)
router.get('/statistics', authenticateToken, searchController.getSearchStats);

module.exports = router; 