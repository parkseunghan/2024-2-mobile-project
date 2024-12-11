const express = require('express'); // express 모듈을 불러옴.
const router = express.Router(); // express 라우터 인스턴스를 생성함.
const Category = require('../models/Category'); // 카테고리 모델을 불러옴.

/**
 * 카테고리 관련 API 라우트를 정의합니다.
 */

// 카테고리 목록 조회
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll(); // 모든 카테고리 조회
        res.json({ 
            categories: [
                { id: 'all', name: '전체' }, // '전체' 카테고리 추가
                ...categories // 조회한 카테고리 추가
            ] 
        });
    } catch (error) {
        console.error('카테고리 목록 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '카테고리 목록 조회에 실패했습니다.' }); // 에러 메시지 반환
    }
});

// 라우터 내보내기
module.exports = router; // 라우터 모듈을 내보냄.
