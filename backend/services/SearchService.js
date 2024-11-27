/**
 * 검색 관련 비즈니스 로직을 처리하는 Service 클래스
 */
class SearchService {
  /**
   * SearchService 생성자
   */
  constructor() {
    this.searchHistory = require('../models/SearchHistory');
  }

  /**
   * 검색 기록을 저장합니다.
   * @param {number} userId - 사용자 ID
   * @param {string} query - 검색어
   * @returns {Promise<number>} 저장된 검색 기록의 ID
   * @throws {Error} 필수 파라미터 누락 시
   */
  async addSearchHistory(userId, query) {
    if (!userId || !query?.trim()) {
      throw new Error('사용자 ID와 검색어가 필요합니다.');
    }
    return await this.searchHistory.add(userId, query.trim());
  }

  /**
   * 사용자의 검색 기록을 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Array>} 검색 기록 목록
   */
  async getUserSearchHistory(userId) {
    if (!userId) return [];
    return await this.searchHistory.getByUserId(userId);
  }

  /**
   * 특정 검색어를 삭제합니다.
   * @param {number} userId - 사용자 ID
   * @param {string} query - 삭제할 검색어
   * @throws {Error} 필수 파라미터 누락 시
   */
  async deleteSearchQuery(userId, query) {
    if (!userId || !query) {
      throw new Error('사용자 ID와 검색어가 필요합니다.');
    }
    await this.searchHistory.deleteQuery(userId, query);
  }

  /**
   * 사용자의 모든 검색 기록을 삭제합니다.
   * @param {number} userId - 사용자 ID
   * @throws {Error} 사용자 ID 누락 시
   */
  async clearUserSearchHistory(userId) {
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }
    await this.searchHistory.deleteByUserId(userId);
  }

  /**
   * 검색 통계를 조회합니다.
   * @returns {Promise<Object>} 검색 통계 정보
   */
  async getSearchStatistics() {
    return await this.searchHistory.getSearchStats();
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
module.exports = new SearchService(); 