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
      if (!query) {
        throw new Error('검색어가 필요합니다.');
      }

      console.log('YouTube API 요청:', {
        query,
        categoryId,
        apiKey: this.apiKey ? '설정됨' : '미설정'
      });

      const params = {
        part: 'snippet',
        maxResults: 25,
        q: query,
        type: 'video',
        key: this.apiKey,
        regionCode: 'KR',  // 한국 결과 우선
        relevanceLanguage: 'ko'  // 한국어 결과 우선
      };

      if (categoryId) {
        params.videoCategoryId = categoryId;
      }

      const response = await axios.get(`${this.baseUrl}/search`, { 
        params,
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('YouTube API 응답 상태:', response.status);
      
      if (!response.data || !response.data.items) {
        console.error('YouTube API 응답:', response.data);
        throw new Error('YouTube API로부터 유효한 응답을 받지 못했습니다.');
      }

      return response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      })).filter(item => item.id && item.thumbnail);

    } catch (error) {
      console.error('YouTube API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 403) {
        throw new Error('YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      }
      
      if (error.response?.status === 400) {
        throw new Error('잘못된 요청입니다. 검색어를 확인해주세요.');
      }
      
      throw new Error(
        error.response?.data?.error?.message || 
        '동영상 검색 중 오류가 발생했습니다.'
      );
    }
  }

  async getVideoDetails(videoId) {
    try {
      if (!videoId) {
        throw new Error('비디오 ID가 필요합니다.');
      }

      console.log('비디오 상세 정보 요청:', videoId);

      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: this.apiKey
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      const videoData = response.data.items?.[0];
      if (!videoData) {
        throw new Error('비디오를 찾을 수 없습니다.');
      }

      return {
        id: videoData.id,
        snippet: {
          title: videoData.snippet.title || '',
          description: videoData.snippet.description || '',
          thumbnails: videoData.snippet.thumbnails || {},
          channelTitle: videoData.snippet.channelTitle || '',
          publishedAt: videoData.snippet.publishedAt || ''
        },
        statistics: {
          viewCount: videoData.statistics?.viewCount || '0',
          likeCount: videoData.statistics?.likeCount || '0'
        }
      };
    } catch (error) {
      console.error('YouTube API 비디오 상세 정보 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 403) {
        throw new Error('YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error('동영상 정보를 가져오는데 실패했습니다.');
    }
  }
}

module.exports = new YoutubeService();