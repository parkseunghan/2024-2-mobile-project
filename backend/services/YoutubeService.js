const axios = require('axios');
require('dotenv').config();

class YoutubeService {
  constructor() {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API 키가 설정되지 않았습니다.');
    }
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async searchVideos(query, categoryId = null) {
    try {
      const params = {
        part: 'snippet',
        maxResults: 25,
        q: query,
        type: 'video',
        key: this.apiKey,
        regionCode: 'KR',
        relevanceLanguage: 'ko'
      };

      if (categoryId) {
        params.videoCategoryId = categoryId;
      }

      const headers = {
        'Accept': 'application/json',
        'Referer': process.env.FRONTEND_URL || 'http://localhost:8081',
        'Origin': process.env.FRONTEND_URL || 'http://localhost:8081'
      };

      const response = await axios.get(`${this.baseUrl}/search`, { 
        params,
        headers
      });

      if (!response.data || !response.data.items) {
        throw new Error('YouTube API로부터 유효한 응답을 받지 못했습니다.');
      }

      return response.data.items;

    } catch (error) {
      console.error('YouTube API 에러:', error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        if (error.response?.data?.error?.message?.includes('referer')) {
          throw new Error('YouTube API 리퍼러 설정이 잘못되었습니다.');
        }
        throw new Error('YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error('동영상 검색 중 오류가 발생했습니다.');
    }
  }

  async getVideoDetails(videoId) {
    try {
      const headers = {
        'Accept': 'application/json',
        'Referer': process.env.FRONTEND_URL || 'http://localhost:8081',
        'Origin': process.env.FRONTEND_URL || 'http://localhost:8081'
      };

      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: this.apiKey
        },
        headers
      });

      if (!response.data.items?.[0]) {
        throw new Error('비디오를 찾을 수 없습니다.');
      }

      return response.data.items[0];
    } catch (error) {
      console.error('YouTube API 비디오 상세 정보 에러:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new YoutubeService();