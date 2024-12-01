import client from './client';

export const searchApi = {
    /**
     * 검색 기록 조회
     */
    getSearchHistory: () => 
        client.get('/search/history'),

    /**
     * 검색 기록 추가
     * @param {string} query - 검색어
     */
    addSearchHistory: (query) => 
        client.post('/search/history', { query }),

    /**
     * 검색 기록 삭제
     * @param {string} query - 삭제할 검색어
     */
    deleteSearchHistory: (query) => 
        client.delete(`/search/history/${encodeURIComponent(query)}`),

    /**
     * 검색 기록 전체 삭제
     */
    clearSearchHistory: () => 
        client.delete('/search/history'),

    /**
     * 검색 결과 조회
     * @param {string} query - 검색어
     */
    search: (query) => 
        client.get('/search', { params: { query } }),

    /**
     * 인기 검색어 조회
     */
    getPopularSearches: () => 
        client.get('/search/popular'),
}; 