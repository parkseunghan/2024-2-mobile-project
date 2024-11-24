const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const SearchHistory = require('../models/SearchHistory');

// 검색 기록 저장
router.post('/history', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: '검색어가 필요합니다.' });
    }

    await SearchHistory.add(req.user.id, query.trim());
    res.json({ success: true });
  } catch (error) {
    console.error('검색 기록 저장 에러:', error);
    res.status(500).json({ message: '검색 기록 저장에 실패했습니다.' });
  }
});

// 검색 기록 조회
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // 사용자가 없는 경우 빈 배열 반환
    if (!req.user) {
      return res.json({ history: [] });
    }
    
    const history = await SearchHistory.getByUserId(req.user.id);
    res.json({ history });
  } catch (error) {
    console.error('검색 기록 조회 에러:', error);
    // 500 에러 대신 빈 배열 반환
    res.json({ history: [] });
  }
});

// 특정 검색어 삭제
router.delete('/history/:query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;
    await SearchHistory.deleteQuery(req.user.id, query);
    res.json({ success: true });
  } catch (error) {
    console.error('검색 기록 삭제 에러:', error);
    res.status(500).json({ message: '검색 기록 삭제에 실패했습니다.' });
  }
});

// 전체 검색 기록 삭제
router.delete('/history', authenticateToken, async (req, res) => {
  try {
    await SearchHistory.deleteByUserId(req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('검색 기록 전체 삭제 에러:', error);
    res.status(500).json({ message: '검색 기록 삭제에 실패했습니다.' });
  }
});

module.exports = router; 