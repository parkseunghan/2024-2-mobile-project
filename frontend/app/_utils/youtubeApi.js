import axios from 'axios';
import { YOUTUBE_API_KEY } from '@env';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// API 키 유효성 검사 및 디버깅
console.log('API Key 확인:', YOUTUBE_API_KEY ? '설정됨' : '미설정');

const youtubeApi = axios.create({
  baseURL: YOUTUBE_API_BASE_URL
});

export const searchVideos = async (query, categoryId = null) => {
  try {
    // 검색어가 비어있는 경우 처리
    if (!query?.trim()) {
      throw new Error('검색어를 입력해주세요.');
    }

    const params = {
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      maxResults: 10,
      q: query,
      type: 'video',
      regionCode: 'KR',  // 한국 결과 우선
      relevanceLanguage: 'ko',  // 한국어 결과 우선
      safeSearch: 'moderate',
      videoEmbeddable: true,
      videoDefinition: 'high'
    };

    if (categoryId) {
      params.videoCategoryId = categoryId;
    }

    // 요청 전 파라미터 로깅
    console.log('검색 요청 파라미터:', {
      ...params,
      key: '(hidden)'  // API 키는 로그에서 숨김
    });

    const response = await youtubeApi.get('/search', { params });
    
    if (!response.data?.items) {
      throw new Error('검색 결과가 없습니다.');
    }

    return response.data.items;
  } catch (error) {
    // 자세한 에러 정보 로깅
    console.error('YouTube API 검색 에러:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config ? {
        url: error.config.url,
        params: {
          ...error.config.params,
          key: '(hidden)'
        }
      } : null
    });
    
    if (error.response?.status === 400) {
      throw new Error('검색 요청이 올바르지 않습니다. 검색어를 확인해주세요.');
    } else if (error.response?.status === 403) {
      throw new Error('API 키가 올바르지 않거나 할당량이 초과되었습니다.');
    }
    
    throw new Error('동영상 검색에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    if (response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}; 