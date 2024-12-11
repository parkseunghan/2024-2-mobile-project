const express = require('express'); // express 모듈을 불러옴.
const router = express.Router(); // express 라우터 인스턴스를 생성함.
const authMiddleware = require('../middleware/authMiddleware'); // 인증 미들웨어를 불러옴.
const profileController = require('../controllers/profileController'); // 프로필 관련 컨트롤러를 불러옴.
const upload = require('../config/multer'); // 파일 업로드 설정을 위한 multer 모듈을 불러옴.

// 모든 프로필 라우트에 인증 미들웨어 적용
router.use(authMiddleware); // 인증 미들웨어를 모든 프로필 관련 라우트에 적용

/**
 * 프로필 관련 API 라우트를 정의합니다.
 */

// 프로필 정보 조회
router.get('/', profileController.getProfile); // 사용자의 프로필 정보 조회

// 프로필 정보 수정
router.put('/', 
  upload.single('avatar'), // 아바타 이미지 업로드 처리
  profileController.updateProfile // 프로필 정보 수정
);

// 사용자의 게시글 목록 조회
router.get('/posts', profileController.getUserPosts); // 사용자가 작성한 게시글 목록 조회

// 사용자의 댓글 목록 조회
router.get('/comments', profileController.getUserComments); // 사용자가 작성한 댓글 목록 조회

// 사용자가 좋아요한 게시글 목록 조회
router.get('/liked-posts', profileController.getLikedPosts); // 사용자가 좋아요를 누른 게시글 목록 조회

module.exports = router; // 라우터 모듈을 내보냄.
