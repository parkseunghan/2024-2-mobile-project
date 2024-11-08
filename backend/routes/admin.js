const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// 미들웨어 체인
router.use(authenticateToken);  // 먼저 인증 체크
router.use(isAdmin);           // 그 다음 관리자 권한 체크

router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deactivateUser);
router.get('/statistics', adminController.getStatistics);

module.exports = router; 