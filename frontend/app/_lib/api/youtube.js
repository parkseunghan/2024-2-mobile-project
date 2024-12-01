import client from './client';

export const youtubeApi = {
    /**
     * 동영상 검색 API
     * @param {string} query - 검색어
     * @param {string} [categoryId] - 카테고리 ID
     * @returns {Promise} API 응답
     */
    search: (query, categoryId) => 
        client.get('/youtube/search', { 
            params: { query, categoryId } 
        }),

    /**
     * 카테고리별 동영상 조회 API
     * @param {string} categoryId - 카테고리 ID
     * @returns {Promise} API 응답
     */
    getVideosByCategory: async (categoryId) => {
        const response = await client.get(`/youtube/category/${categoryId}`);
        return response;
    },

    /**
     * 동영상 상세 정보 조회 API
     * @param {string} videoId - 유튜브 비디오 ID
     * @returns {Promise} API 응답
     */
    getVideoDetails: async (videoId) => {
        console.log('Fetching video details for:', videoId);
        const response = await client.get(`/youtube/videos/${videoId}`);
        return response;
    },

    /**
     * 동영상 검색 API
     * @param {string} query - 검색어
     * @param {string} [categoryId] - 카테고리 ID
     * @returns {Promise} API 응답
     */
    searchVideos: async (query, categoryId) => {
        const response = await client.get('/youtube/search', {
            params: { query, categoryId }
        });
        return response;
    }
}; 