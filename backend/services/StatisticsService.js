const NodeCache = require('node-cache');

/**
 * 통계 관련 비즈니스 로직을 처리하는 Service 클래스
 */
class StatisticsService {
  /**
   * StatisticsService 생성자
   * @param {StatisticsRepository} statisticsRepository - 통계 Repository 인스턴스
   */
  constructor(statisticsRepository) {
    this.statisticsRepository = statisticsRepository;
    this.cache = new NodeCache({ stdTTL: 300 }); // 5분 캐시
  }

  /**
   * 캐시된 통계 정보를 조회합니다.
   * @returns {Promise<Object>} 통합 통계 정보
   */
  async getCachedStatistics() {
    const cacheKey = 'statistics';
    let statistics = this.cache.get(cacheKey);

    if (!statistics) {
      statistics = await this.getCompleteStatistics();
      this.cache.set(cacheKey, statistics);
    }

    return statistics;
  }

  /**
   * 전체 통계 정보를 조회합니다.
   * @returns {Promise<Object>} 통합 통계 정보
   */
  async getCompleteStatistics() {
    const [basicStats, growthStats, roleDistribution, activityStats] = 
      await Promise.all([
        this.statisticsRepository.getBasicStats(),
        this.statisticsRepository.getGrowthStats(),
        this.statisticsRepository.getRoleDistribution(),
        this.statisticsRepository.getActivityStats()
      ]);

    return {
      basicStats,
      growthStats,
      roleDistribution,
      activityStats
    };
  }

  /**
   * 일일 통계를 조회합니다.
   * @returns {Promise<Object>} 일일 통계 정보
   */
  static async getDailyStats() {
    // 일일 통계 로직 구현
    return {};
  }

  /**
   * 사용자 증가 통계를 조회합니다.
   * @param {number} period - 조회 기간
   * @returns {Promise<Array>} 기간별 사용자 증가 통계
   */
  static async getUserGrowthStats(period) {
    // 사용자 증가 통계 로직 구현
    return [];
  }

  /**
   * 활동 통계를 조회합니다.
   * @returns {Promise<Object>} 활동 통계 정보
   */
  static async getActivityStats() {
    // 활동 통계 로직 구현
    return {};
  }
}

module.exports = StatisticsService; 