const awilix = require('awilix');
const StatisticsRepository = require('../repositories/StatisticsRepository');
const StatisticsService = require('../services/StatisticsService');
const db = require('./database');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

container.register({
  db: awilix.asValue(db),
  statisticsRepository: awilix.asClass(StatisticsRepository),
  statisticsService: awilix.asClass(StatisticsService)
});

module.exports = container; 