const User = require('../models/User');
const StatisticsService = require('../services/StatisticsService');
const StatisticsRepository = require('../repositories/StatisticsRepository');
const db = require('../config/database');
const SearchHistory = require('../models/SearchHistory');
const Category = require('../models/Category');

const statisticsRepository = new StatisticsRepository(db);
const statisticsService = new StatisticsService(statisticsRepository);

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const users = await User.getAllUsers(page, limit, search);
    
    res.json({ 
      success: true, 
      users,
      page,
      limit,
      hasMore: users.length === limit
    });
  } catch (error) {
    console.error('사용자 목록 조회 에러:', error);
    res.status(500).json({ 
      success: false, 
      message: '사용자 목록 조회에 실패했습니다.',
      error: error.message 
    });
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

exports.getDailyStatistics = async (req, res) => {
  try {
    const stats = await StatisticsService.getDailyStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('일일 통 조회 에러:', error);
    res.status(500).json({ message: '통계 조회에 실패했습니다.' });
  }
};

exports.getUserGrowthStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const stats = await StatisticsService.getUserGrowthStats(parseInt(period));
    res.json({ success: true, stats });
  } catch (error) {
    console.error('사용자 증가 통계 조회 에러:', error);
    res.status(500).json({ message: '통계 조회에 실패했습니다.' });
  }
};

exports.getActivityStats = async (req, res) => {
  try {
    const stats = await StatisticsService.getActivityStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('활동 통계 조회 에러:', error);
    res.status(500).json({ message: '통계 조회에 실패했습니다.' });
  }
};

exports.getSearchStats = async (req, res) => {
  try {
    const stats = await SearchHistory.getSearchStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('검색 통계 조회 에러:', error);
    res.status(500).json({ message: '통계 조회에 실패했습니다.' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (error) {
    console.error('카테고리 목록 조회 에러:', error);
    res.status(500).json({ message: '카테고리 목록 조회에 실패했습니다.' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const created_by = req.user.id;

    const category = await Category.create({ 
      name, 
      description, 
      created_by 
    });
    
    res.status(201).json({ 
      message: '카테고리가 생성되었습니다.',
      category 
    });
  } catch (error) {
    console.error('카테고리 생성 에러:', error);
    res.status(500).json({ message: '카테고리 생성에 실패했습니다.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await Category.update(id, { name, description });
    res.json({ message: '카테고리가 수정되었습니다.' });
  } catch (error) {
    console.error('카테고리 수정 에러:', error);
    res.status(500).json({ message: '카테고리 수정에 실패했습니다.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 카테고리 존재 여부 확인
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 습니다.' });
    }

    // 카테고리 삭제
    const deleted = await Category.delete(id);
    if (!deleted) {
      return res.status(400).json({ message: '카테고리 삭제에 실패했습니다.' });
    }

    res.json({ message: '카테고리가 삭제되었습니다.' });
  } catch (error) {
    console.error('카테고리 삭제 에러:', error);
    res.status(500).json({ message: '카테고리 삭제에 실패했습니다.' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: '잘못된 상태값입니다.' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ 
      success: true, 
      message: '사용자 상태가 업데이트되었습니다.',
      user 
    });
  } catch (error) {
    console.error('사용자 상태 업데이트 에러:', error);
    res.status(500).json({ message: '사용자 상태 업데이트에 실패했습니다.' });
  }
};