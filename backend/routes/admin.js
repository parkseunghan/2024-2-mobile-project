const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// 인증 및 관리자 권한 체크 미들웨어 적용
router.use(authMiddleware);  // 먼저 인증 체크
router.use(adminMiddleware); // 그 다음 관리자 권한 체크

// 관리자 라우트
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deactivateUser);
router.get('/statistics/daily', adminController.getDailyStatistics);
router.get('/statistics/user-growth', adminController.getUserGrowthStats);
router.get('/statistics/activity', adminController.getActivityStats);
router.get('/statistics/search', adminController.getSearchStats);
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router; 