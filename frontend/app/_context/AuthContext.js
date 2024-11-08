import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import api from '@app/_utils/api';
import storage from '@app/_utils/storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signupEmail, setSignupEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.getItem('userToken');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      await storage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', { email });
      
      // 기존 세션 정리
      await storage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      console.log('Login response:', response.data);
      
      const { user, token } = response.data;
      
      if (!user || !token) {
        console.error('Missing user or token in response:', response.data);
        throw new Error('로그인 응답에 필요한 정보가 없습니다.');
      }

      await storage.setItem('userToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      router.replace('/(tabs)/home');  // 로그인 성공 시 홈 화면으로 리다이렉트
      return user;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

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
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout failed:', error);
    } finally {
      await storage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      router.replace('/login');
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

export const useAuth = () => useContext(AuthContext);