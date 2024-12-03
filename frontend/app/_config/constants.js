/**
 * 앱 상수 정의
 * - 전역적으로 사용되는 상수값 관리
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
  
  /**
   * 카테고리 정의
   * - id: 카테고리 식별자
   * - icon: 아이콘 이름 (Ionicons)
   * - color: 카테고리 색상
   * - title: 카테고리 제목
   * - searchKeywords: 검색에 사용될 키워드
   */
  export const CATEGORIES = [
    {
      id: 'study',
      icon: 'school',
      color: '#1E88E5',
      title: '공부',
      subItems: [
        { id: 'study-1', title: '시험 준비', icon: 'clipboard', color: '#1E88E5', searchKeywords: '공부 시험준비 노트정리 학습' },
        { id: 'study-2', title: '노트 정리', icon: 'book', color: '#1E88E5', searchKeywords: '공부 노트정리 학습 노트' },
        { id: 'study-3', title: '학습 계획', icon: 'calendar', color: '#1E88E5', searchKeywords: '공부 학습 계획 학습 계획표' },
      ],
    },
    {
      id: 'cooking',
      icon: 'restaurant',
      color: '#E64A19',
      title: '요리',
      subItems: [
        { id: 'cooking-1', title: '레시피', icon: 'book-open', color: '#E64A19', searchKeywords: '요리 레시피 요리 맛집 음식' },
        { id: 'cooking-2', title: '맛집 추천', icon: 'pin', color: '#E64A19', searchKeywords: '요리 맛집 음식 맛집 추천' },
        { id: 'cooking-3', title: '음식 장식', icon: 'brush', color: '#E64A19', searchKeywords: '요리 음식 장식 요리 꿀팁' },
      ],
    },
    {
      id: 'computer',
      icon: 'laptop',
      color: '#4CAF50',
      title: '컴퓨터',
      subItems: [
        { id: 'computer-1', title: '프로그램 설치', icon: 'settings', color: '#4CAF50', searchKeywords: '컴퓨터 관리 프로그램 설치' },
        { id: 'computer-2', title: '컴퓨터 관리', icon: 'desktop', color: '#4CAF50', searchKeywords: '컴퓨터 관리 컴퓨터 설정' },
        { id: 'computer-3', title: '키보드 단축키', icon: 'keyboard', color: '#4CAF50', searchKeywords: '컴퓨터 키보드 단축키 컴퓨터 사용법' },
      ],
    },
    {
      id: 'smartphone',
      icon: 'phone-portrait',
      color: '#FDD835',
      title: '스마트폰',
      subItems: [
        { id: 'smartphone-1', title: '앱 설정', icon: 'apps', color: '#FDD835', searchKeywords: '스마트폰 사용법 앱 설정' },
        { id: 'smartphone-2', title: '사진 촬영 팁', icon: 'camera', color: '#FDD835', searchKeywords: '스마트폰 사진 촬영 팁' },
        { id: 'smartphone-3', title: '배터리 절약', icon: 'battery-charging', color: '#FDD835', searchKeywords: '스마트폰 배터리 절약' },
      ],
    },
    {
      id: 'life',
      icon: 'home',
      color: '#FF5722',
      title: '생활',
      subItems: [
        { id: 'life-1', title: '청소 팁', icon: 'broom', color: '#FF5722', searchKeywords: '생활 청소 정리' },
        { id: 'life-2', title: '정리 방법', icon: 'box', color: '#FF5722', searchKeywords: '생활 정리 방법 수납정리' },
        { id: 'life-3', title: '공간 활용', icon: 'grid', color: '#FF5722', searchKeywords: '생활 공간 활용 수납정리' },
      ],
    },
    {
      id: 'exercise',
      icon: 'barbell',
      color: '#8BC34A',
      title: '운동',
      subItems: [
        { id: 'exercise-1', title: '스트레칭', icon: 'accessibility', color: '#8BC34A', searchKeywords: '운동 스트레칭 피트니스' },
        { id: 'exercise-2', title: '근력 운동', icon: 'dumbbell', color: '#8BC34A', searchKeywords: '운동 근력 운동 피트니스' },
        { id: 'exercise-3', title: '유산소 운동', icon: 'heart', color: '#8BC34A', searchKeywords: '운동 유산소 운동 피트니스' },
      ],
    },
    {
      id: 'fashion',
      icon: 'shirt',
      color: '#9C27B0',
      title: '패션',
      subItems: [
        { id: 'fashion-1', title: '스타일링', icon: 'color-palette', color: '#9C27B0', searchKeywords: '패션 스타일 옷 코디' },
        { id: 'fashion-2', title: '패션 트렌드', icon: 'ribbon', color: '#9C27B0', searchKeywords: '패션 트렌드 옷 코디' },
        { id: 'fashion-3', title: '계절별 코디', icon: 'sunny', color: '#9C27B0', searchKeywords: '계절별 코디 옷 코디' },
      ],
    },
    {
      id: 'car',
      icon: 'car-sport',
      color: '#FF9800',
      title: '자동차',
      subItems: [
        { id: 'car-1', title: '정비 방법', icon: 'wrench', color: '#FF9800', searchKeywords: '자동차 정비방법 차량관리 운전방법 자동차설명 자동차 꿀팁' },
        { id: 'car-2', title: '차량 관리', icon: 'car', color: '#FF9800', searchKeywords: '자동차 차량관리 차량정비 차량설명 자동차 꿀팁' },
        { id: 'car-3', title: '운전 기술', icon: 'steering', color: '#FF9800', searchKeywords: '자동차 운전기술 운전법 운전방법 자동차 꿀팁' },
      ],
    },
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
  
  export const API_URL = 'http://localhost:3000/api';  // 백엔드 API 기본 URL 