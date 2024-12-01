import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH } from '@app/_config/constants';
import client from '@app/_lib/api/client';
import { useRouter } from 'expo-router';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH.TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await client.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('사용자 정보 로드 에러:', error);
      await AsyncStorage.removeItem(AUTH.TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩 시 사용자 정보 가져오기
  useEffect(() => {
    loadUserInfo();
  }, []);

  // role 기반 관리자 권한 체크 함수
  const isAdmin = useMemo(() => {
    return user?.role === 'admin' || user?.role === 'god';
  }, [user?.role]);

  const login = async (credentials) => {
    try {
      const response = await client.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // 기존 데이터 초기화
      await AsyncStorage.clear();
      
      // 새로운 토큰 저장
      await AsyncStorage.setItem('token', token);
      setUser(user);
      
      // 홈으로 이동 후 새로고침 효과
      router.replace('/');
      
      return { success: true };
    } catch (error) {
      console.error('로그인 에러:', error);
      return {
        success: false,
        error: error.response?.data?.message || '로그인에 실패했습니다.'
      };
    }
  };

  const logout = async () => {
    try {
      await client.post('/auth/logout');
      setUser(null);
      // 모든 로컬 스토리지 데이터 초기화
      await AsyncStorage.clear();
    } catch (error) {
      console.error('로그아웃 에러:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    loadUserInfo,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
}

