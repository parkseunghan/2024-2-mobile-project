import api from './api';

export const searchVideos = async (query, categoryId = null) => {
  try {
    const params = { query };
    if (categoryId) {
      params.categoryId = categoryId;
    }

    const response = await api.get('/youtube/search', { params });
    return response.data.videos;
  } catch (error) {
    console.error('동영상 검색 에러:', error);
    throw new Error(
      error.response?.data?.error || 
      '동영상을 검색하는데 실패했습니다.'
    );
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    if (!videoId) {
      throw new Error('비디오 ID가 필요합니다.');
    }
    
    const response = await api.get(`/youtube/videos/${videoId}`);
    
    if (!response.data?.videoDetails) {
      throw new Error('비디오 데이터를 찾을 수 없습니다.');
    }
    
    return response.data.videoDetails;
  } catch (error) {
    console.error('동영상 상세 정보 에러:', error);
    if (error.response?.status === 404) {
      throw new Error('해당 동영상을 찾을 수 없습니다.');
    }
    throw new Error(
      error.response?.data?.error || 
      '동영상 정보를 불러오는데 실패했습니다.'
    );
  }
};