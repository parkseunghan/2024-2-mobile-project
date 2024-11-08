// 인증 관련 커스텀 훅
// export const useAuth = () => {
//     // AuthContext 사용을 위한 래퍼
//     // 인증 상태 및 메서드 제공
//     // - 로그인 상태
//     // - 사용자 정보
//     // - 로그인/로그아웃 메서드
//   };

import { useContext } from 'react';
import { AuthContext } from '@app/_context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
