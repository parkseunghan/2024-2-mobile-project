class StatisticsService {
  constructor(statisticsRepository) {
    this.statisticsRepository = statisticsRepository;
  }

  async getCompleteStatistics() {
    const [basicStats, growthStats, roleDistribution, activityStats] = await Promise.all([
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
}

module.exports = StatisticsService; 