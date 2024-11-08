// API 통신을 위한 axios 인스턴스 설정 및 관리
// - baseURL 설정 (기본 API 엔드포인트)
// - 인터셉터를 통한 요청/응답 처리
// - 토큰 자동 주입
// - 에러 핸들링

import axios from 'axios';
import storage from './storage';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// 요청 인터셉터
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

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await storage.removeItem('userToken');
        delete api.defaults.headers.common['Authorization'];
        
        // expo-router를 사용하여 리다이렉트
        router.replace('/(auth)/login');
      } catch (e) {
        console.error('Error handling 401:', e);
      }
    }
    return Promise.reject(error);
  }
);

// 토큰 설정 헬퍼 함수
api.setToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api; 