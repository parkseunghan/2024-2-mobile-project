const express = require('express'); // express 모듈을 불러옴.
const router = express.Router(); // express 라우터 인스턴스를 생성함.
const User = require('../models/User'); // User 모델을 불러옴.

/**
 * 사용자 관련 라우트를 정의합니다.
 */

// 유저 랭킹 조회
router.get('/rankings', async (req, res) => {
  console.log('[userRoutes] /rankings 요청 받음');
  try {
    const rankings = await User.getRankings(); // 사용자 랭킹 조회
    console.log('[userRoutes] 랭킹 조회 성공:', rankings.length);
    res.json({ data: rankings }); // 조회된 랭킹 정보를 반환
  } catch (error) {
    console.error('[userRoutes] 랭킹 조회 에러:', error);
    res.status(500).json({ error: '랭킹 정보를 불러오는데 실패했습니다.' }); // 에러 메시지 반환
  }
});

module.exports = router; // 라우터 모듈을 내보냄.
