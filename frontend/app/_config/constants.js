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
      icon: 'school-outline',
      color: '#1E88E5',
      title: '공부',
      subItems: [
        { id: 'study-1', title: '시험 준비', icon: 'document-text-outline', color: '#1E88E5', searchKeywords: '공부 시험준비 노트정리 학습' },
        { id: 'study-2', title: '노트 정리', icon: 'documents-outline', color: '#1E88E5', searchKeywords: '공부 노트정리 학습 노트' },
        { id: 'study-3', title: '학습 계획', icon: 'calendar-number-outline', color: '#1E88E5', searchKeywords: '공부 학습 계획 학습 계획표' },
        { id: 'study-4', title: '집중력 향상', icon: 'timer-sand-outline', color: '#1E88E5', searchKeywords: '집중력 공부 효율성' },
        { id: 'study-5', title: '그룹 스터디', icon: 'people-outline', color: '#1E88E5', searchKeywords: '그룹 스터디 공부 방법' },
        { id: 'study-6', title: '효율적 복습', icon: 'refresh-outline', color: '#1E88E5', searchKeywords: '효율적 복습 학습 방법' },
      ],
    },
    {
      id: 'cooking',
      icon: 'restaurant-outline',
      color: '#E64A19',
      title: '요리',
      subItems: [
        { id: 'cooking-1', title: '레시피', icon: 'pizza-outline', color: '#E64A19', searchKeywords: '요리 레시피 요리 맛집 음식' },
        { id: 'cooking-2', title: '맛집 추천', icon: 'location-outline', color: '#E64A19', searchKeywords: '요리 맛집 음식 맛집 추천' },
        { id: 'cooking-3', title: '음식 장식', icon: 'color-palette-outline', color: '#E64A19', searchKeywords: '요리 음식 장식 요리 꿀팁' },
        { id: 'cooking-4', title: '건강 요리', icon: 'leaf-outline', color: '#E64A19', searchKeywords: '건강 요리 레시피 식단' },
        { id: 'cooking-5', title: '빠른 요리법', icon: 'fast-food-outline', color: '#E64A19', searchKeywords: '간단 요리 빠른 요리' },
        { id: 'cooking-6', title: '디저트 레시피', icon: 'ice-cream-outline', color: '#E64A19', searchKeywords: '디저트 요리 레시피' },
      ],
    },
    {
      id: 'computer',
      icon: 'laptop-outline',
      color: '#4CAF50',
      title: '컴퓨터',
      subItems: [
        { id: 'computer-1', title: '프로그램 설치', icon: 'cloud-download-outline', color: '#4CAF50', searchKeywords: '컴퓨터 관리 프로그램 설치' },
        { id: 'computer-2', title: '컴퓨터 관리', icon: 'settings-outline', color: '#4CAF50', searchKeywords: '컴퓨터 관리 컴퓨터 설정' },
        { id: 'computer-3', title: '키보드 단축키', icon: 'keypad-outline', color: '#4CAF50', searchKeywords: '컴퓨터 키보드 단축키 컴퓨터 사용법' },
        { id: 'computer-4', title: '인터넷 보안', icon: 'shield-outline', color: '#4CAF50', searchKeywords: '인터넷 보안 컴퓨터 안전' },
        { id: 'computer-5', title: '디스크 정리', icon: 'trash-outline', color: '#4CAF50', searchKeywords: '디스크 정리 최적화' },
        { id: 'computer-6', title: '소프트웨어 업데이트', icon: 'cloud-sync-outline', color: '#4CAF50', searchKeywords: '소프트웨어 업데이트 관리' },
      ],
    },
    {
      id: 'smartphone',
      icon: 'phone-portrait-outline',
      color: '#FDD835',
      title: '스마트폰',
      subItems: [
        { id: 'smartphone-1', title: '앱 설정', icon: 'apps-outline', color: '#FDD835', searchKeywords: '스마트폰 사용법 앱 설정' },
        { id: 'smartphone-2', title: '사진 촬영 팁', icon: 'camera-outline', color: '#FDD835', searchKeywords: '스마트폰 사진 촬영 팁' },
        { id: 'smartphone-3', title: '배터리 절약', icon: 'battery-half-outline', color: '#FDD835', searchKeywords: '스마트폰 배터리 절약' },
        { id: 'smartphone-4', title: '화면 최적화', icon: 'contrast-outline', color: '#FDD835', searchKeywords: '화면 밝기 설정 스마트폰 최적화' },
        { id: 'smartphone-5', title: '앱 사용 팁', icon: 'help-circle-outline', color: '#FDD835', searchKeywords: '앱 사용법 스마트폰 팁' },
        { id: 'smartphone-6', title: '보안 설정', icon: 'shield-checkmark-outline', color: '#FDD835', searchKeywords: '스마트폰 보안 설정' },
      ],
    },
    {
      id: 'life',
      icon: 'home-outline',
      color: '#FF5722',
      title: '생활',
      subItems: [
        { id: 'life-1', title: '청소 팁', icon: 'brush-outline', color: '#FF5722', searchKeywords: '생활 청소 정리' },
        { id: 'life-2', title: '정리 방법', icon: 'file-tray-full-outline', color: '#FF5722', searchKeywords: '생활 정리 방법 수납정리' },
        { id: 'life-3', title: '공간 활용', icon: 'expand-outline', color: '#FF5722', searchKeywords: '생활 공간 활용 수납정리' },
        { id: 'life-4', title: '홈 인테리어', icon: 'home-modern-outline', color: '#FF5722', searchKeywords: '인테리어 집 꾸미기 생활 공간' },
        { id: 'life-5', title: '생활 습관', icon: 'clock-outline', color: '#FF5722', searchKeywords: '생활 습관 건강 관리' },
        { id: 'life-6', title: '집 꾸미기', icon: 'paint-outline', color: '#FF5722', searchKeywords: '집 꾸미기 인테리어' },
      ],
    },
    {
      id: 'exercise',
      icon: 'barbell-outline',
      color: '#8BC34A',
      title: '운동',
      subItems: [
        { id: 'exercise-1', title: '스트레칭', icon: 'body-outline', color: '#8BC34A', searchKeywords: '운동 스트레칭 피트니스' },
        { id: 'exercise-2', title: '근력 운동', icon: 'fitness-outline', color: '#8BC34A', searchKeywords: '운동 근력 운동 피트니스' },
        { id: 'exercise-3', title: '유산소 운동', icon: 'walk-outline', color: '#8BC34A', searchKeywords: '운동 유산소 운동 피트니스' },
        { id: 'exercise-4', title: '요가', icon: 'sunny-outline', color: '#8BC34A', searchKeywords: '운동 요가 피트니스' },
        { id: 'exercise-5', title: '헬스케어', icon: 'pulse-outline', color: '#8BC34A', searchKeywords: '헬스케어 운동 피트니스' },
        { id: 'exercise-6', title: '운동 기구 사용법', icon: 'barbell-outline', color: '#8BC34A', searchKeywords: '운동 기구 사용법 피트니스' },
      ],
    },
    {
      id: 'fashion',
      icon: 'shirt-outline',
      color: '#9C27B0',
      title: '패션',
      subItems: [
        { id: 'fashion-1', title: '스타일링', icon: 'shirt-outline', color: '#9C27B0', searchKeywords: '패션 스타일 옷 코디' },
        { id: 'fashion-2', title: '패션 트렌드', icon: 'trending-up-outline', color: '#9C27B0', searchKeywords: '패션 트렌드 옷 코디' },
        { id: 'fashion-3', title: '계절별 코디', icon: 'partly-sunny-outline', color: '#9C27B0', searchKeywords: '계절별 코디 옷 코디' },
        { id: 'fashion-4', title: '유행 아이템', icon: 'flash-outline', color: '#9C27B0', searchKeywords: '유행 패션 아이템' },
        { id: 'fashion-5', title: '액세서리', icon: 'accessibility-outline', color: '#9C27B0', searchKeywords: '패션 액세서리 스타일' },
        { id: 'fashion-6', title: '패션 쇼핑', icon: 'cart-outline', color: '#9C27B0', searchKeywords: '패션 쇼핑 스타일 추천' },
      ],
    },
    {
      id: 'car',
      icon: 'car-sport-outline',
      color: '#FF9800',
      title: '자동차',
      subItems: [
        { id: 'car-1', title: '정비 방법', icon: 'construct-outline', color: '#FF9800', searchKeywords: '자동차 정비방법 차량관리 운전방법 자동차설명 자동차 꿀팁' },
        { id: 'car-2', title: '차량 관리', icon: 'medical-outline', color: '#FF9800', searchKeywords: '자동차 차량관리 차량정비 차량설명 자동차 꿀팁' },
        { id: 'car-3', title: '운전 기술', icon: 'speedometer-outline', color: '#FF9800', searchKeywords: '자동차 운전기술 운전법 운전방법 자동차 꿀팁' },
        { id: 'car-4', title: '자동차 세차', icon: 'car-outline', color: '#FF9800', searchKeywords: '자동차 세차 관리' },
        { id: 'car-5', title: '기름값 절약', icon: 'gas-station-outline', color: '#FF9800', searchKeywords: '자동차 기름값 절약' },
        { id: 'car-6', title: '주차 팁', icon: 'parking-outline', color: '#FF9800', searchKeywords: '자동차 주차 팁' },
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