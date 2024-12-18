const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// 게시글 목록 조회
router.get('/posts', communityController.getPosts);

// 좋아요한 게시글 목록 조회 (인증 필요)
router.get('/posts/liked', authMiddleware, communityController.getLikedPosts);

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

// 투표하기 (인증 필요)
router.post('/posts/:postId/vote/:optionId', authMiddleware, communityController.vote);

// 좋아요 토글 (인증 필요)
router.post('/posts/:postId/like', authMiddleware, communityController.toggleLike);

// 조회수 증가
router.post('/posts/:postId/view', communityController.incrementViewCount);

module.exports = router; 