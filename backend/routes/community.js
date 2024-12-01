const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// 게시글 목록 조회
router.get('/posts', communityController.getPosts);

// 게시글 상세 조회
router.get('/posts/:postId', communityController.getPostDetail);

// 게시글 작성 (인증 필요)
router.post('/posts', authMiddleware, communityController.createPost);

// 게시글 수정 (인증 필요)
router.put('/posts/:postId', authMiddleware, communityController.updatePost);

// 게시글 삭제 (인증 필요)
router.delete('/posts/:postId', authMiddleware, communityController.deletePost);

// 댓글 작성 (인증 필요)
router.post('/posts/:postId/comments', authMiddleware, communityController.createComment);

// 댓글 삭제 (인증 필요)
router.delete('/comments/:commentId', authMiddleware, communityController.deleteComment);

module.exports = router; 