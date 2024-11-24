const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const upload = require('../config/multer');

// 모든 프로필 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 프로필 정보 조회
router.get('/', profileController.getProfile);

// 프로필 정보 수정
router.put('/', 
  upload.single('avatar'),
  profileController.updateProfile
);

// 사용자의 게시글 목록
router.get('/posts', profileController.getUserPosts);

// 사용자의 댓글 목록
router.get('/comments', profileController.getUserComments);

// 사용자가 좋아요한 게시글 목록
router.get('/liked-posts', profileController.getLikedPosts);

module.exports = router; 