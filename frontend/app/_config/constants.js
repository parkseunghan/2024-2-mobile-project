/**
 * 앱 상수 정의
 * 전역적으로 사용되는 상수값 관리
 */

// API 관련 상수
export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
};

// 인증 관련 상수
export const AUTH = {
  TOKEN_KEY: 'userToken',
  TOKEN_EXPIRY: '24h',
  MIN_PASSWORD_LENGTH: 6,
};

// 비디오 관련 상수
export const VIDEO = {
  THUMBNAIL_SIZE: {
    width: 320,
    height: 180,
  },
  PLAYER_ASPECT_RATIO: 16 / 9,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
};

// 카테고리 관련 상수
export const CATEGORIES = [
  { id: 'car', icon: 'car-sport', color: '#FF5733', title: '자동차 팁' },
  { id: 'home', icon: 'home', color: '#4CAF50', title: '생활 팁' },
  { id: 'travel', icon: 'airplane', color: '#FFC107', title: '여행 팁' },
  { id: 'tech', icon: 'laptop', color: '#2196F3', title: '기술 팁' },
  { id: 'food', icon: 'restaurant', color: '#9C27B0', title: '요리 팁' },
  { id: 'fashion', icon: 'shirt', color: '#FF9800', title: '패션 팁' },
];

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  AUTH_REQUIRED: '로그인이 필요한 서비스입니다.',
  INVALID_INPUT: '입력값을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
};

// 페이지네이션 설정
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES: 100,
}; 