const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const communityController = require('../controllers/communityController');
const upload = require('../config/multer');

// Public routes
router.get('/posts', communityController.getPosts);
router.get('/posts/:id', communityController.getPost);

// Protected routes
router.post('/posts', authenticateToken, upload.single('media'), communityController.createPost);
router.put('/posts/:id', authenticateToken, upload.single('media'), communityController.updatePost);
router.delete('/posts/:id', authenticateToken, communityController.deletePost);
router.post('/posts/:id/like', authenticateToken, communityController.toggleLike);
router.post('/posts/:id/comments', authenticateToken, communityController.createComment);

module.exports = router; 