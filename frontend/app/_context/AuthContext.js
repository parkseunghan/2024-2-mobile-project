import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import api from '@app/_utils/api';
import storage from '@app/_utils/storage';
import { SearchContext } from './SearchContext';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signupEmail, setSignupEmail] = useState('');
  const router = useRouter();
  const searchContext = useContext(SearchContext);

  useEffect(() => {
    checkAuth();
  }, []);

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