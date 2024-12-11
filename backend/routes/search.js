const express = require('express'); // express 모듈을 불러옴.
const router = express.Router(); // express 라우터 인스턴스를 생성함.
const searchController = require('../controllers/searchController'); // 검색 관련 컨트롤러를 불러옴.

/**
 * 검색 관련 API 라우트를 정의합니다.
 */

// 통합 검색
router.get('/', searchController.search); // 모든 유형의 검색 수행

// 카테고리별 검색
router.get('/category/:categoryId', searchController.searchByCategory); // 특정 카테고리의 검색 수행

module.exports = router; // 라우터 모듈을 내보냄.
