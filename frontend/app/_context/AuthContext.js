import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import api from '@app/_utils/api';
import storage from '@app/_utils/storage';
import { SearchContext } from './SearchContext';

/**
 * 인증 관련 Context
 * - 사용자 인증 상태 관리
 * - 로그인/로그아웃/회원가입 기능 제공
 */
export const AuthContext = createContext({});

/**
 * 인증 Provider 컴포넌트
 * @param {ReactNode} children - 자식 컴포넌트
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signupEmail, setSignupEmail] = useState('');
  const router = useRouter();
  const searchContext = useContext(SearchContext);

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * 인증 상태 확인
   * - 저장된 토큰으로 사용자 정보 조회
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await storage.getItem('userToken');
      
      if (!token) {
        setUser(null);
        api.setToken(null);
        setIsLoading(false);
        return;
      }

      api.setToken(token);
      
      try {
        const response = await api.get('/auth/me');
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          throw new Error('User data not found');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        await storage.removeItem('userToken');
        api.setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await storage.removeItem('userToken');
      api.setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그인 함수
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      await storage.setItem('userToken', token);
      api.setToken(token);
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout failed:', error);
    } finally {
      await storage.removeItem('userToken');
      api.setToken(null);
      setUser(null);
      if (searchContext) {
        searchContext.clearAll();
      }
    }
  };

  /**
   * 회원가입 함수
   * @param {string} username - 사용자명
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   */
  const signup = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password
      });
      setSignupEmail(email);
      return response.data.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      signup,
      checkAuth,
      signupEmail,
      setSignupEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}