import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 기본 설정으로 axios 인스턴스 생성
export const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 60000, // 타임아웃을 60초로 증가
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API 요청 인터셉터
client.interceptors.request.use(
    async (config) => {
        // 요약 API에 대해서는 타임아웃 연장
        if (config.url.includes('/youtube/summarize')) {
            config.timeout = 120000; // 요약 API는 120초로 설정
        }
        
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        try {
            console.log('API Request:', {
                method: config.method,
                url: `${config.baseURL}${config.url}`,
                timeout: config.timeout,
                headers: config.headers
            });
            return config;
        } catch (error) {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// API 응답 인터셉터
client.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('API Timeout:', {
                url: error.config?.url,
                timeout: error.config?.timeout
            });
        }
        return Promise.reject(error);
    }
);

export default client; 