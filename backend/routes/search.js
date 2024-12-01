const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

// 통합 검색
router.get('/', searchController.search);

// 카테고리별 검색
router.get('/category/:categoryId', searchController.searchByCategory);

module.exports = router; 