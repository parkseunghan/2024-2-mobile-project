const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const upload = require('../config/multer');

// 프로필 정보 조회
router.get('/', authenticateToken, profileController.getProfile);

// 프로필 정보 수정
router.put('/', 
  authenticateToken, 
  upload.single('avatar'),
  profileController.updateProfile
);

// 사용자의 게시글 목록
router.get('/posts', authenticateToken, profileController.getUserPosts);

// 사용자의 댓글 목록
router.get('/comments', authenticateToken, profileController.getUserComments);

// 사용자가 좋아요한 게시글 목록
router.get('/liked-posts', authenticateToken, profileController.getLikedPosts);

module.exports = router; 