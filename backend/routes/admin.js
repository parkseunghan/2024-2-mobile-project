const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// 미들웨어 체인
router.use(authenticateToken);  // 먼저 인증 체크
router.use(isAdmin);           // 그 다음 관리자 권한 체크

// 사용자 관리
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deactivateUser);

// 통계 관리
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await statisticsService.getCompleteStatistics();
    res.json({ statistics });
  } catch (error) {
    console.error('통계 조회 에러:', error);
    res.status(500).json({ message: '통계 정보 조회에 실패했습니다.' });
  }
});
router.get('/statistics/daily', adminController.getDailyStatistics);
router.get('/statistics/user-growth', adminController.getUserGrowthStats);
router.get('/statistics/activity', adminController.getActivityStats);

// 검색 통계
router.get('/statistics/search', adminController.getSearchStats);

module.exports = router; 