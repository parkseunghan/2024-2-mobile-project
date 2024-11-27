const SearchService = require('../services/SearchService');

/**
 * 검색 관련 컨트롤러
 */
class SearchController {
    /**
     * 검색 기록 저장
     */
    async addSearchHistory(req, res) {
        try {
            const { query } = req.body;
            if (!query?.trim()) {
                return res.status(400).json({ message: '검색어가 필요합니다.' });
            }

            await SearchService.addSearchHistory(req.user.id, query);
            res.json({ success: true });
        } catch (error) {
            console.error('검색 기록 저장 에러:', error);
            res.status(500).json({ message: '검색 기록 저장에 실패했습니다.' });
        }
    }

    /**
     * 검색 기록 조회
     */
    async getSearchHistory(req, res) {
        try {
            const history = await SearchService.getUserSearchHistory(req.user?.id);
            res.json({ history });
        } catch (error) {
            console.error('검색 기록 조회 에러:', error);
            res.json({ history: [] });
        }
    }

    /**
     * 특정 검색어 삭제
     */
    async deleteSearchQuery(req, res) {
        try {
            const { query } = req.params;
            await SearchService.deleteSearchQuery(req.user.id, query);
            res.json({ success: true });
        } catch (error) {
            console.error('검색 기록 삭제 에러:', error);
            res.status(500).json({ message: '검색 기록 삭제에 실패했습니다.' });
        }
    }

    /**
     * 전체 검색 기록 삭제
     */
    async clearSearchHistory(req, res) {
        try {
            await SearchService.clearUserSearchHistory(req.user.id);
            res.json({ success: true });
        } catch (error) {
            console.error('검색 기록 전체 삭제 에러:', error);
            res.status(500).json({ message: '검색 기록 삭제에 실패했습니다.' });
        }
    }

    /**
     * 검색 통계 조회
     */
    async getSearchStats(req, res) {
        try {
            const stats = await SearchService.getSearchStatistics();
            res.json({ success: true, stats });
        } catch (error) {
            console.error('검색 통계 조회 에러:', error);
            res.status(500).json({ message: '검색 통계 조회에 실패했습니다.' });
        }
    }
}

module.exports = new SearchController(); 