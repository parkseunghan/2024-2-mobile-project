const SearchHistory = require('../models/SearchHistory');

class SearchService {
    /**
     * 검색 기록 저장
     */
    async addSearchHistory(userId, query) {
        if (!userId || !query?.trim()) {
            throw new Error('사용자 ID와 검색어가 필요합니다.');
        }
        return await SearchHistory.add(userId, query.trim());
    }

    /**
     * 사용자의 검색 기록 조회
     */
    async getUserSearchHistory(userId) {
        if (!userId) return [];
        return await SearchHistory.getByUserId(userId);
    }

    /**
     * 특정 검색어 삭제
     */
    async deleteSearchQuery(userId, query) {
        if (!userId || !query) {
            throw new Error('사용자 ID와 검색어가 필요합니다.');
        }
        await SearchHistory.deleteQuery(userId, query);
    }

    /**
     * 사용자의 모든 검색 기록 삭제
     */
    async clearUserSearchHistory(userId) {
        if (!userId) {
            throw new Error('사용자 ID가 필요합니다.');
        }
        await SearchHistory.deleteByUserId(userId);
    }

    /**
     * 검색 통계 조회
     */
    async getSearchStatistics() {
        return await SearchHistory.getSearchStats();
    }
}

module.exports = new SearchService(); 