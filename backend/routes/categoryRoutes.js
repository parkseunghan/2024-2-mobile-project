const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// 카테고리 목록 조회
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ 
            categories: [
                { id: 'all', name: '전체' }, // '전체' 카테고리 추가
                ...categories
            ] 
        });
    } catch (error) {
        console.error('카테고리 목록 조회 에러:', error);
        res.status(500).json({ message: '카테고리 목록 조회에 실패했습니다.' });
    }
});

// 라우터 내보내기 추가
module.exports = router; 