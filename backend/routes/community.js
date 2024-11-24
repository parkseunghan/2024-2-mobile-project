const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/posts', communityController.getPosts);
router.get('/posts/:id', communityController.getPost);

// Protected routes
router.post('/posts', authenticateToken, communityController.createPost);
router.put('/posts/:id', authenticateToken, communityController.updatePost);
router.delete('/posts/:id', authenticateToken, communityController.deletePost);
router.post('/posts/:id/like', authenticateToken, communityController.toggleLike);
router.post('/posts/:id/comments', authenticateToken, communityController.createComment);

module.exports = router; 