/*
라우터 설정: Express의 라우터를 사용하여 관리자 관련 API 엔드포인트를 설정함.
미들웨어 적용: authMiddleware와 adminMiddleware를 사용하여 인증된 사용자만 접근할 수 있도록 하고, 관리자인지 확인함.
사용자 관리: 사용자 조회, 역할 업데이트, 비활성화 등의 기능을 제공함.
통계 조회: 일일 통계, 사용자 성장 통계, 활동 통계, 검색 통계 등을 조회할 수 있는 엔드포인트를 제공함.
카테고리 관리: 카테고리 조회, 생성, 업데이트, 삭제 기능을 제공함.
연결된 파일
controllers/adminController.js: 각 라우트에서 호출되는 기능을 구현한 컨트롤러 파일로, 실제 비즈니스 로직이 여기서 처리됨.
middleware/authMiddleware.js: 사용자의 인증 상태를 확인하는 미들웨어 파일.
middleware/adminMiddleware.js: 사용자가 관리자인지 확인하는 미들웨어 파일
*/

// express 모듈을 불러와 라우터를 생성함.
const express = require('express');
// 라우터 인스턴스를 생성함.
const router = express.Router();
// 관리자 관련 기능을 처리하는 컨트롤러를 불러옴.
const adminController = require('../controllers/adminController');
// 인증 관련 미들웨어를 불러옴.
const authMiddleware = require('../middleware/authMiddleware');
// 관리자 권한 체크 미들웨어를 불러옴.
const adminMiddleware = require('../middleware/adminMiddleware');

// 인증 및 관리자 권한 체크 미들웨어 적용
router.use(authMiddleware);  // 먼저 인증 체크 제공.
router.use(adminMiddleware); // 그 다음 관리자 권한 체크 제공.

// 관리자 라우트
router.get('/users', adminController.getUsers); // 모든 사용자 조회 제공.
router.put('/users/:id/role', adminController.updateUserRole); // 특정 사용자의 역할 업데이트 제공.
router.delete('/users/:id', adminController.deactivateUser); // 특정 사용자 비활성화 제공.
router.get('/statistics/daily', adminController.getDailyStatistics); // 일일 통계 조회 제공.
router.get('/statistics/user-growth', adminController.getUserGrowthStats); // 사용자 성장 통계 조회 제공.
router.get('/statistics/activity', adminController.getActivityStats); // 활동 통계 조회 제공.
router.get('/statistics/search', adminController.getSearchStats); // 검색 통계 조회 제공.
router.get('/categories', adminController.getCategories); // 모든 카테고리 조회 제공.
router.post('/categories', adminController.createCategory); // 새로운 카테고리 생성 제공.
router.put('/categories/:id', adminController.updateCategory); // 특정 카테고리 업데이트 제공.
router.delete('/categories/:id', adminController.deleteCategory); // 특정 카테고리 삭제 제공.

// 라우터를 모듈로 내보냄.
module.exports = router; 
