const User = require('../models/User');
const StatisticsService = require('../services/StatisticsService');
const StatisticsRepository = require('../repositories/StatisticsRepository');
const db = require('../config/database');

const statisticsRepository = new StatisticsRepository(db);
const statisticsService = new StatisticsService(statisticsRepository);

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const users = await User.getAllUsers(page);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: '사용자 목록 조회에 실패했습니다.' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: '유효하지 않은 역할입니다.' });
    }

    const success = await User.updateRole(id, role);
    if (!success) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '사용자 역할이 업데이트되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '역할 업데이트에 실패했습니다.' });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await User.deactivateUser(id);
    
    if (!success) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '사용자가 비활성화되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '사용자 비활성화에 실패했습니다.' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.getCachedStatistics();
    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error('통계 조회 에러:', error);
    res.status(500).json({ 
      success: false,
      message: '통계 정보 조회에 실패했습니다.' 
    });
  }
};