/**
 * 스타일 모듈 진입점
 * 모든 스타일 관련 파일들을 한 곳에서 내보내기
 */

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';

// 공통 스타일 유틸리티
export const createStyleSheet = (styles) => {
  return Object.keys(styles).reduce((acc, key) => {
    acc[key] = {
      ...styles[key],
      // 여기에 공통으로 적용할 스타일이 있다면 추가
    };
    return acc;
  }, {});
};

// 반응형 스타일 유틸리티
export const getResponsiveStyles = (width) => {
  if (width >= theme.breakpoints.desktop) {
    return 'desktop';
  }
  if (width >= theme.breakpoints.tablet) {
    return 'tablet';
  }
  return 'mobile';
};

// 플랫폼별 스타일 유틸리티
export const getPlatformStyles = (styles) => {
  const { Platform } = require('react-native');
  return Platform.select({
    ios: {
      ...styles,
      // iOS 전용 스타일
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      ...styles,
      // Android 전용 스타일
      elevation: 5,
    },
    web: {
      ...styles,
      // 웹 전용 스타일
      cursor: 'pointer',
      ':hover': {
        opacity: 0.8,
      },
    },
    default: styles,
  });
};

// 테마 변형 유틸리티
export const getThemeVariant = (variant = 'default') => {
  const variants = {
    default: theme,
    dark: {
      ...theme,
      colors: {
        ...theme.colors,
        background: {
          primary: '#000000',
          secondary: '#1C1C1E',
          tertiary: '#2C2C2E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8E8E93',
          tertiary: '#48484A',
        },
      },
    },
    // 추가 테마 변형이 필요하다면 여기에 정의
  };

  return variants[variant] || variants.default;
}; 