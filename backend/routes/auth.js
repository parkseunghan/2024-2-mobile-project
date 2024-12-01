const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// 회원가입
router.post('/signup', authController.signup);

// 로그인
router.post('/login', authController.login);

// 로그아웃
router.post('/logout', authController.logout);

// 현재 사용자 정보 조회
router.get('/me', authMiddleware, authController.getMe);

module.exports = router; 