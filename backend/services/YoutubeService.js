const axios = require('axios'); // axios 모듈을 불러옴.
const NodeCache = require('node-cache'); // 캐시 관리를 위한 node-cache 모듈을 불러옴.
const { CATEGORIES } = require('../config/constants'); // 카테고리 상수를 불러옴.

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
      throw new Error('YouTube API 키가 설정되지 않았습니다.'); // API 키가 설정되지 않은 경우 에러 발생
    }
    this.apiKey = process.env.YOUTUBE_API_KEY; // YouTube API 키
    this.baseUrl = 'https://www.googleapis.com/youtube/v3'; // YouTube API 기본 URL
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시 설정
    this.headers = this.getDefaultHeaders(); // 기본 HTTP 헤더 설정
  }

  /**
   * 기본 HTTP 헤더를 반환합니다.
   * @private
   * @returns {Object} HTTP 헤더 객체
   */
  getDefaultHeaders() {
    return {
      'Accept': 'application/json',
      'Referer': process.env.FRONTEND_URL || 'http://localhost:8081', // 프론트엔드 URL 설정
      'Origin': process.env.FRONTEND_URL || 'http://localhost:8081' // 오리진 설정
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
      const cacheKey = `search:${query}:${categoryId}`; // 캐시 키 생성
      const cachedResult = this.cache.get(cacheKey); // 캐시에서 결과 조회
      
      if (cachedResult) {
        return cachedResult; // 캐시된 결과 반환
      }

      const params = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 10,
        regionCode: 'KR', // 지역 코드 설정
        key: this.apiKey // API 키 설정
      };

      if (categoryId) {
        params.videoCategoryId = categoryId; // 카테고리 ID가 있을 경우 추가
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params,
        headers: this.headers // 요청 헤더 설정
      });

      if (!response.data?.items) {
        throw new Error('검색 결과가 없습니다.'); // 검색 결과가 없을 경우 에러 발생
      }

      this.cache.set(cacheKey, response.data.items); // 결과 캐시
      return response.data.items; // 검색 결과 반환
    } catch (error) {
      console.error('YouTube 검색 에러:', error); // 에러 로그 출력
      throw error; // 에러 발생
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
      console.log('Getting video details for:', videoId); // 비디오 ID 로깅
      const cacheKey = `video:${videoId}`; // 캐시 키 생성
      const cachedResult = this.cache.get(cacheKey); // 캐시에서 결과 조회
      
      if (cachedResult) {
        console.log('Returning cached video details'); // 캐시된 결과 반환 로깅
        return cachedResult; // 캐시된 결과 반환
      }

      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics', // 필요한 데이터 부분 설정
          id: videoId, // 비디오 ID 설정
          key: this.apiKey // API 키 설정
        },
        headers: this.headers // 요청 헤더 설정
      });

      console.log('YouTube API response status:', response.status); // 응답 상태 로깅

      if (!response.data?.items?.[0]) {
        throw new Error('비디오를 찾을 수 없습니다.'); // 비디오가 없을 경우 에러 발생
      }

      const videoDetails = response.data.items[0]; // 비디오 상세 정보
      this.cache.set(cacheKey, videoDetails); // 결과 캐시
      return videoDetails; // 비디오 상세 정보 반환
    } catch (error) {
      console.error('Video details error:', error.response?.data || error.message); // 에러 로그 출력
      throw error; // 에러 발생
    }
  }

  /**
   * API 에러를 처리합니다.
   * @private
   * @param {Error} error - 발생한 에러
   * @throws {Error} 처리된 에러
   */
  handleApiError(error) {
    console.error('YouTube API 에러:', error.response?.data || error.message); // API 에러 로그 출력
    
    if (error.response?.status === 403) {
      if (error.response?.data?.error?.message?.includes('referer')) {
        throw new Error('YouTube API 리퍼러 설정이 잘못되었습니다.'); // 리퍼러 설정 에러
      }
      throw new Error('YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.'); // 할당량 초과 에러
    }
    
    throw new Error('YouTube API 요청 중 오류가 발생했습니다.'); // 일반 API 요청 에러
  }

  /**
   * 전체 캐시를 삭제합니다.
   */
  clearCache() {
    this.cache.flushAll(); // 캐시 전체 삭제
    console.log('캐시 전체 삭제됨'); // 로그 출력
  }

  /**
   * 특정 검색어의 캐시를 삭제합니다.
   * @param {string} query - 검색어
   */
  clearSearchCache(query) {
    const cacheKey = `search:${query}:null`; // 캐시 키 생성
    this.cache.del(cacheKey); // 캐시 삭제
    console.log('검색 캐시 삭제됨:', query); // 로그 출력
  }

  /**
   * 특정 비디오의 캐시를 삭제합니다.
   * @param {string} videoId - 비디오 ID
   */
  clearVideoCache(videoId) {
    const cacheKey = `video:${videoId}`; // 캐시 키 생성
    this.cache.del(cacheKey); // 캐시 삭제
    console.log('비디오 캐시 삭제됨:', videoId); // 로그 출력
}

/**
 * 추천 동영상을 가져옵니다.
 * @returns {Promise<Array>} 추천 동영상 목록
 * @throws {Error} API 요청 실패 시
 */
async getRecommendedVideos() {
  try {
    const cacheKey = 'recommended'; // 캐시 키 생성
    const cachedResult = this.cache.get(cacheKey); // 캐시에서 결과 조회
    
    if (cachedResult) {
      return cachedResult; // 캐시된 결과 반환
    }

    const response = await axios.get(`${this.baseUrl}/videos`, {
      params: {
        part: 'snippet',
        chart: 'mostPopular', // 인기 동영상 차트
        regionCode: 'KR', // 지역 코드 설정
        maxResults: 10, // 최대 결과 수
        key: this.apiKey // API 키 설정
      }
    });

    if (!response.data?.items) {
      throw new Error('카천 비디오를 가져오는데 실패했습니다.'); // 결과가 없을 경우 에러 발생
    }

    this.cache.set(cacheKey, response.data.items); // 결과 캐시
    return response.data.items; // 추천 동영상 반환
  } catch (error) {
    console.error('카천 비디오 조회 에러:', error); // 에러 로그 출력
    throw error; // 에러 발생
  }
}

/**
 * 특정 카테고리의 동영상을 가져옵니다.
 * @param {string} categoryId - 카테고리 ID
 * @returns {Promise<Array>} 동영상 목록
 * @throws {Error} API 요청 실패 시
 */
async getCategoryVideos(categoryId) {
  try {
    const cacheKey = `category:${categoryId}`; // 캐시 키 생성
    const cachedResult = this.cache.get(cacheKey); // 캐시에서 결과 조회
    
    if (cachedResult) {
      console.log('Returning cached result for category:', categoryId); // 캐시된 결과 반환 로깅
      return cachedResult; // 캐시된 결과 반환
    }

    console.log('Fetching videos for category:', categoryId); // 카테고리 로깅
    
    // 서브카테고리 찾기
    let searchKeywords;
    for (const category of CATEGORIES) {
      const subItem = category.subItems?.find(sub => sub.id === categoryId);
      if (subItem) {
        searchKeywords = subItem.searchKeywords; // 검색 키워드 설정
        break;
      }
    }

    if (!searchKeywords) {
      console.error('Category not found:', categoryId); // 카테고리 미발견 로그
      throw new Error('카테고리를 찾을 수 없습니다.'); // 카테고리 찾기 실패 에러
    }

    console.log('Using search keywords:', searchKeywords); // 사용 중인 검색 키워드 로깅

    const response = await axios.get(`${this.baseUrl}/search`, {
      params: {
        part: 'snippet',
        q: searchKeywords, // 검색 키워드 설정
        type: 'video',
        maxResults: 10, // 최대 결과 수
        regionCode: 'KR', // 지역 코드 설정
        key: this.apiKey // API 키 설정
      },
      headers: this.headers // 요청 헤더 설정
    });

    console.log('YouTube API Response status:', response.status); // API 응답 상태 로깅

    if (!response.data?.items?.length) {
      throw new Error('검색 결과가 없습니다.'); // 결과가 없을 경우 에러 발생
    }

    this.cache.set(cacheKey, response.data.items); // 결과 캐시
    return response.data.items; // 카테고리 동영상 반환
  } catch (error) {
    console.error('카테고리 비디오 조회 에러:', error); // 에러 로그 출력
    throw error; // 에러 발생
  }
}
}

// 싱글톤 인스턴스 생성 및 내보내기
module.exports = new YoutubeService(); // YoutubeService 인스턴스를 내보냄.

