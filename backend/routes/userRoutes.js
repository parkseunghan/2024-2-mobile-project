const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 유저 랭킹 조회
router.get('/rankings', async (req, res) => {
  console.log('[userRoutes] /rankings 요청 받음');
  try {
    const rankings = await User.getRankings();
    console.log('[userRoutes] 랭킹 조회 성공:', rankings.length);
    res.json({ data: rankings });
  } catch (error) {
    console.error('[userRoutes] 랭킹 조회 에러:', error);
    res.status(500).json({ error: '랭킹 정보를 불러오는데 실패했습니다.' });
  }
});

module.exports = router; 