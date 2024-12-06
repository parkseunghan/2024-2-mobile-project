import client from './client';

export const userApi = {
  /**
   * 유저 랭킹 정보를 가져옵니다.
   * @returns {Promise<Object>} 랭킹 정보
   */
  getRankings: async () => {
    try {
      console.log('[userApi] getRankings 호출');
      console.log('[userApi] baseURL:', client.defaults.baseURL);
      
      const response = await client.get('/users/rankings');
      console.log('[userApi] getRankings 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('[userApi] getRankings 에러:', error.response || error);
      throw error;
    }
  },
}; 