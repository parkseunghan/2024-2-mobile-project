const express = require('express'); // express 모듈을 불러옴.
const router = express.Router(); // express 라우터 인스턴스를 생성함.
const searchController = require('../controllers/searchController'); // 검색 관련 컨트롤러를 불러옴.
const authMiddleware = require('../middleware/authMiddleware'); // 인증 미들웨어를 불러옴.

/**
 * 검색 기록 관련 라우트를 정의합니다.
 * 인증 미들웨어를 적용하여 사용자 인증을 요구합니다.
 */

// 검색 기록 추가
router.post('/history', authMiddleware, searchController.addSearchHistory);

// 검색 기록 조회
router.get('/history', authMiddleware, searchController.getSearchHistory);

// 모든 검색 기록 삭제
router.delete('/history', authMiddleware, searchController.clearSearchHistory);

// 특정 검색 기록 항목 삭제
router.delete('/history/:query', authMiddleware, searchController.deleteSearchHistoryItem);

module.exports = router; // 라우터 모듈을 내보냄.
