import { useContext } from 'react';
import { AuthContext } from '@app/_context/AuthContext';

/**
 * 인증 관련 커스텀 훅
 * - AuthContext의 값들을 쉽게 사용할 수 있도록 제공
 * - 컨텍스트가 없는 경우 에러 발생
 * 
 * @returns {Object} AuthContext의 모든 값과 함수들
 * @throws {Error} AuthContext가 없는 경우
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
