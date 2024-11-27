const axios = require('axios');
const NodeCache = require('node-cache');

/**
 * YouTube API 관련 기능을 처리하는 Service 클래스
 */
class YoutubeService {
  /**
   * YoutubeService 생성자
   * @throws {Error} YouTube API 키가 설정되지 않은 경우
   */
  constructor() {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API 키가 설정되지 않았습니다.');
    }
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시
    this.headers = this.getDefaultHeaders();
  }

  /**
   * 기본 HTTP 헤더를 반환합니다.
   * @private
   * @returns {Object} HTTP 헤더 객체
   */
  getDefaultHeaders() {
    return {
      'Accept': 'application/json',
      'Referer': process.env.FRONTEND_URL || 'http://localhost:8081',
      'Origin': process.env.FRONTEND_URL || 'http://localhost:8081'
    };
  }

  /**
   * YouTube 동영상을 검색합니다.
   * @param {string} query - 검색어
   * @param {string|null} categoryId - 카테고리 ID
   * @returns {Promise<Array>} 검색 결과 목록
   * @throws {Error} API 요청 실패 시
   */
  async searchVideos(query, categoryId = null) {
    try {
      const cacheKey = `search:${query}:${categoryId || 'null'}`;
      const cachedResult = this.cache.get(cacheKey);
      
      if (cachedResult) {
        console.log('캐시된 검색 결과 반환:', query);
        return cachedResult;
      }

      const params = {
        part: 'snippet',
        maxResults: 10,
        q: query,
        type: 'video',
        key: this.apiKey,
        regionCode: 'KR',
        relevanceLanguage: 'ko',
        ...(categoryId && { videoCategoryId: categoryId })
      };

      const response = await axios.get(`${this.baseUrl}/search`, { 
        params,
        headers: this.headers
      });

      if (!response.data?.items) {
        throw new Error('YouTube API로부터 유효한 응답을 받지 못했습니다.');
      }

      this.cache.set(cacheKey, response.data.items);
      return response.data.items;

    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * 동영상 상세 정보를 조회합니다.
   * @param {string} videoId - 동영상 ID
   * @returns {Promise<Object>} 동영상 상세 정보
   * @throws {Error} API 요청 실패 시
   */
  async getVideoDetails(videoId) {
    try {
      const cacheKey = `video:${videoId}`;
      const cachedResult = this.cache.get(cacheKey);
      
      if (cachedResult) {
        console.log('캐시된 비디오 상세 정보 반환:', videoId);
        return cachedResult;
      }

      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: this.apiKey
        },
        headers: this.headers
      });

      if (!response.data.items?.[0]) {
        throw new Error('비디오를 찾을 수 없습니다.');
      }

      this.cache.set(cacheKey, response.data.items[0]);
      return response.data.items[0];
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * API 에러를 처리합니다.
   * @private
   * @param {Error} error - 발생한 에러
   * @throws {Error} 처리된 에러
   */
  handleApiError(error) {
    console.error('YouTube API 에러:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      if (error.response?.data?.error?.message?.includes('referer')) {
        throw new Error('YouTube API 리퍼러 설정이 잘못되었습니다.');
      }
      throw new Error('YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw new Error('YouTube API 요청 중 오류가 발생했습니다.');
  }

  /**
   * 전체 캐시를 삭제합니다.
   */
  clearCache() {
    this.cache.flushAll();
    console.log('캐시 전체 삭제됨');
  }

  /**
   * 특정 검색어의 캐시를 삭제합니다.
   * @param {string} query - 검색어
   */
  clearSearchCache(query) {
    const cacheKey = `search:${query}:null`;
    this.cache.del(cacheKey);
    console.log('검색 캐시 삭제됨:', query);
  }

  /**
   * 특정 비디오의 캐시를 삭제합니다.
   * @param {string} videoId - 비디오 ID
   */
  clearVideoCache(videoId) {
    const cacheKey = `video:${videoId}`;
    this.cache.del(cacheKey);
    console.log('비디오 캐시 삭제됨:', videoId);
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
module.exports = new YoutubeService();