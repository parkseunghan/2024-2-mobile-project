const express = require('express'); // express 모듈을 불러옴.
const router = express.Router(); // express 라우터 인스턴스를 생성함.
const youtubeController = require('../controllers/youtubeController'); // YouTube 관련 컨트롤러를 불러옴.
const authMiddleware = require('../middleware/authMiddleware'); // 인증 미들웨어를 불러옴.

/**
 * YouTube 관련 API 라우트를 정의합니다.
 */

// 인증이 필요한 라우트
router.post('/summarize', authMiddleware, youtubeController.summarizeVideo); // 비디오 요약 요청

// 인증이 필요하지 않은 라우트
router.get('/category/:categoryId', youtubeController.getCategoryVideos); // 특정 카테고리의 비디오 조회
router.get('/videos/:videoId', youtubeController.getVideoDetails); // 비디오 상세 정보 조회
router.get('/search', youtubeController.searchVideos); // 비디오 검색
router.get('/summary/:videoId', youtubeController.getVideoSummary); // 비디오 요약 정보 조회

module.exports = router; // 라우터 모듈을 내보냄.
