const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 관리자 권한 체크 미들웨어
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
};

// 미들웨어 체인 적용
router.use(authenticateToken);  // 먼저 인증 체크
router.use(isAdmin);           // 그 다음 관리자 권한 체크

// 사용자 관리
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deactivateUser);

// 통계 관리
router.get('/statistics/daily', adminController.getDailyStatistics);
router.get('/statistics/user-growth', adminController.getUserGrowthStats);
router.get('/statistics/activity', adminController.getActivityStats);

// 검색 통계
router.get('/statistics/search', adminController.getSearchStats);

module.exports = router; 