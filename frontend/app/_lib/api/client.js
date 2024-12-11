import axios from 'axios'; // axios 모듈을 불러옴.
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 모듈을 불러옴.

/**
 * 기본 설정으로 axios 인스턴스를 생성합니다.
 * @type {axios.AxiosInstance}
 */
export const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api', // 기본 API URL 설정
    timeout: 60000, // 타임아웃을 60초로 설정
    withCredentials: true, // 쿠키 전송 여부 설정
    headers: {
        'Content-Type': 'application/json', // 요청 헤더 설정
    }
});

// API 요청 인터셉터
client.interceptors.request.use(
    async (config) => {
        // 요약 API에 대해서는 타임아웃 연장
        if (config.url.includes('/youtube/summarize')) {
            config.timeout = 120000; // 요약 API는 120초로 설정
        }
        
        const token = await AsyncStorage.getItem('token'); // 저장된 토큰 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 토큰을 Authorization 헤더에 추가
        }
        try {
            console.log('API Request:', {
                method: config.method,
                url: `${config.baseURL}${config.url}`,
                timeout: config.timeout,
                headers: config.headers
            });
            return config; // 수정된 config 반환
        } catch (error) {
            console.error('Request interceptor error:', error);
            return Promise.reject(error); // 에러 발생 시 Promise reject
        }
    },
    error => {
        console.error('Request error:', error); // 요청 에러 로그 출력
        return Promise.reject(error); // 에러 발생 시 Promise reject
    }
);

// API 응답 인터셉터
client.interceptors.response.use(
    response => {
        return response; // 응답 반환
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('API Timeout:', {
                url: error.config?.url, // 타임아웃 발생한 URL
                timeout: error.config?.timeout // 타임아웃 설정 값
            });
        }
        return Promise.reject(error); // 에러 발생 시 Promise reject
    }
);

export default client; // axios 클라이언트를 내보냄.
