import client from './client';
import { authApi } from './auth';
import { youtubeApi } from './youtube';
import { profileApi } from './profile';
import { communityApi } from './community';
import { searchApi } from './search';
import { userApi } from './userApi';

// 기본 API 설정
client.defaults.headers.common['Content-Type'] = 'application/json';
client.defaults.withCredentials = true;

// API 모듈 통합 export
export {
    client as default,
    authApi,
    youtubeApi,
    profileApi,
    communityApi,
    searchApi,
    userApi,
};

// 토큰 설정 헬퍼 함수
export const setToken = (token) => {
    if (token) {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete client.defaults.headers.common['Authorization'];
    }
}; 