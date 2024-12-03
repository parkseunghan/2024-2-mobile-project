import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';
import { AUTH } from '@app/_config/constants';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [signupEmail, setSignupEmail] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem(AUTH.TOKEN_KEY);
            if (token) {
                const response = await authApi.getMe();
                const userData = response.data.user;
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            await AsyncStorage.removeItem(AUTH.TOKEN_KEY);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authApi.login({ email, password });
            const { token, user } = response.data;
            
            await AsyncStorage.setItem(AUTH.TOKEN_KEY, token);
            setUser(user);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            await AsyncStorage.removeItem(AUTH.TOKEN_KEY);
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            console.log('useAuth - signup attempt:', userData);
            const response = await authApi.signup(userData);
            console.log('useAuth - signup response:', response);
            setSignupEmail(userData.email);
            return response.data;
        } catch (error) {
            console.error('회원가입 실패:', error);
            throw error;
        }
    };

    return {
        user,
        isLoading,
        signup,
        login,
        logout,
        signupEmail,
        setSignupEmail,
        checkAuthStatus
    };
} 