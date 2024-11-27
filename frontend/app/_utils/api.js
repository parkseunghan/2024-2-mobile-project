/**
 * API 통신을 위한 axios 인스턴스 설정 및 관리
 */
import axios from 'axios';
import storage from './storage';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

/**
 * 요청 인터셉터
 * - 토큰이 있는 경우 Authorization 헤더에 추가
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Token retrieval error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 401 에러 처리 (인증 실패)
 * - 토큰 만료 시 로그인 페이지로 리다이렉트
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
      
      if (!error.config.requiresAuth) {
        return Promise.resolve({ data: null });
      }
      
      if (router) {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 토큰 설정 헬퍼 함수
 * @param {string} token - JWT 토큰
 */
api.setToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api; 