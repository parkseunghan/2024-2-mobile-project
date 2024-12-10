/*
기능 설명
사용자 조회: getUsers 함수는 페이지네이션과 검색 기능을 포함하여 모든 사용자를 조회하여 반환함.
사용자 역할 업데이트: updateUserRole 함수는 특정 사용자의 역할을 업데이트하며, 유효한 역할인지 확인함.
사용자 비활성화: deactivateUser 함수는 특정 사용자를 비활성화함.
통계 조회: 여러 통계 관련 함수(getStatistics, getDailyStatistics, getUserGrowthStats, getActivityStats, getSearchStats)가 있으며, 각각의 통계 정보를 조회하여 반환함.
카테고리 관리: 카테고리 관련 함수(getCategories, createCategory, updateCategory, deleteCategory)가 있으며, 카테고리를 조회, 생성, 수정, 삭제하는 기능을 제공함.
사용자 상태 업데이트: updateUserStatus 함수는 사용자의 상태(활성화/비활성화)를 업데이트함. 유효한 상태인지 확인하고, 해당 사용자 존재 여부를 체크함.

연결된 파일
models/User.js: 사용자 관련 데이터 모델로, 사용자의 CRUD 연산을 처리함.
services/StatisticsService.js: 통계 관련 비즈니스 로직을 처리하는 서비스 파일로, 통계 데이터를 조회하는 기능을 제공함.
repositories/StatisticsRepository.js: 통계 데이터를 데이터베이스에서 가져오는 로직을 포함함.
models/SearchHistory.js: 검색 기록과 관련된 데이터 모델로, 검색 통계 조회에 사용됨.
models/Category.js: 카테고리 관련 데이터 모델로, 카테고리 관리 기능에 사용됨.
config/database.js: 데이터베이스 연결 설정을 포함함.
*/

// User 모델을 불러옴.
const User = require('../models/User');
// 통계 서비스를 불러옴.
const StatisticsService = require('../services/StatisticsService');
// 통계 저장소를 불러옴.
const StatisticsRepository = require('../repositories/StatisticsRepository');
// 데이터베이스 연결 설정을 불러옴.
const db = require('../config/database');
// 검색 기록 모델을 불러옴.
const SearchHistory = require('../models/SearchHistory');
// 카테고리 모델을 불러옴.
const Category = require('../models/Category');

// 통계 저장소 인스턴스를 생성함.
const statisticsRepository = new StatisticsRepository(db);
// 통계 서비스 인스턴스를 생성함.
const statisticsService = new StatisticsService(statisticsRepository);

// 모든 사용자 조회 함수
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 페이지 번호 설정
    const limit = parseInt(req.query.limit) || 20; // 페이지당 사용자 수 설정
    const search = req.query.search || ''; // 검색어 설정

    const users = await User.getAllUsers(page, limit, search); // 사용자 목록 조회
    
    res.json({ 
      success: true, 
      users,
      page,
      limit,
      hasMore: users.length === limit // 다음 페이지 여부 제공
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

// 사용자 역할 업데이트 함수
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 사용자 ID 가져옴
    const { role } = req.body; // 요청 body에서 역할 가져옴
    
    if (!['user', 'admin'].includes(role)) { // 유효한 역할인지 확인
      return res.status(400).json({ message: '유효하지 않은 역할입니다.' }); 
    }

    const success = await User.updateRole(id, role); // 사용자 역할 업데이트
    if (!success) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' }); 
    }

    res.json({ success: true, message: '사용자 역할이 업데이트되었습니다.' }); 
  } catch (error) {
    res.status(500).json({ message: '역할 업데이트에 실패했습니다.' }); 
  }
};

// 사용자 비활성화 함수
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 사용자 ID 가져옴
    const success = await User.deactivateUser(id); // 사용자 비활성화
    
    if (!success) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' }); 
    }

    res.json({ success: true, message: '사용자가 비활성화되었습니다.' }); 
  } catch (error) {
    res.status(500).json({ message: '사용자 비활성화에 실패했습니다.' }); 
  }
};

// 통계 조회 함수
exports.getStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.getCachedStatistics(); // 캐시된 통계 조회
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

// 일일 통계 조회 함수
exports.getDailyStatistics = async (req, res) => {
  try {
    const stats = await StatisticsService.getDailyStats(); // 일일 통계 조회
    res.json({ success: true, stats });
  } catch (error) {
    console.error('일일 통계 조회 에러:', error); 
    res.status(500).json({ message: '통계 조회에 실패했습니다.' }); 
  }
};

// 사용자 증가 통계 조회 함수
exports.getUserGrowthStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // 기간 설정
    const stats = await StatisticsService.getUserGrowthStats(parseInt(period)); // 사용자 증가 통계 조회
    res.json({ success: true, stats });
  } catch (error) {
    console.error('사용자 증가 통계 조회 에러:', error); 
    res.status(500).json({ message: '통계 조회에 실패했습니다.' }); 
  }
};

// 활동 통계 조회 함수
exports.getActivityStats = async (req, res) => {
  try {
    const stats = await StatisticsService.getActivityStats(); // 활동 통계 조회
    res.json({ success: true, stats });
  } catch (error) {
    console.error('활동 통계 조회 에러:', error); 
    res.status(500).json({ message: '통계 조회에 실패했습니다.' }); 
  }
};

// 검색 통계 조회 함수
exports.getSearchStats = async (req, res) => {
  try {
    const stats = await SearchHistory.getSearchStats(); // 검색 통계 조회
    res.json({ success: true, stats });
  } catch (error) {
    console.error('검색 통계 조회 에러:', error); 
    res.status(500).json({ message: '통계 조회에 실패했습니다.' }); 
  }
};

// 카테고리 목록 조회 함수
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll(); // 모든 카테고리 조회
    res.json({ categories });
  } catch (error) {
    console.error('카테고리 목록 조회 에러:', error); 
    res.status(500).json({ message: '카테고리 목록 조회에 실패했습니다.' }); 
  }
};

// 카테고리 생성 함수
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body; // 요청 body에서 카테고리 정보 가져옴
    const created_by = req.user.id; // 생성자 정보 가져옴

    const category = await Category.create({ 
      name, 
      description, 
      created_by 
    }); // 카테고리 생성
    
    res.status(201).json({ 
      message: '카테고리가 생성되었습니다.',
      category 
    });
  } catch (error) {
    console.error('카테고리 생성 에러:', error); 
    res.status(500).json({ message: '카테고리 생성에 실패했습니다.' }); 
  }
};

// 카테고리 업데이트 함수
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 카테고리 ID 가져옴
    const { name, description } = req.body; // 요청 body에서 카테고리 정보 가져옴
    await Category.update(id, { name, description }); // 카테고리 업데이트
    res.json({ message: '카테고리가 수정되었습니다.' }); 
  } catch (error) {
    console.error('카테고리 수정 에러:', error); 
    res.status(500).json({ message: '카테고리 수정에 실패했습니다.' }); 
  }
};

// 카테고리 삭제 함수
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 카테고리 ID 가져옴
    
    // 카테고리 존재 여부 확인
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' }); 
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

// 사용자 상태 업데이트 함수
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 사용자 ID 가져옴
    const { status } = req.body; // 요청 body에서 상태 가져옴
    
    if (!['active', 'inactive'].includes(status)) { // 유효한 상태인지 확인
      return res.status(400).json({ message: '유효하지 않은 상태입니다.' }); 
    }

    const success = await User.updateStatus(id, status); // 사용자 상태 업데이트
    if (!success) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' }); 
    }

    res.json({ 
      success: true, 
      message: `사용자가 ${status === 'active' ? '활성화' : '비활성화'}되었습니다.` 
    });
  } catch (error) {
    console.error('사용자 상태 업데이트 에러:', error); 
    res.status(500).json({ message: '상태 업데이트에 실패했습니다.' }); 
  }
};
