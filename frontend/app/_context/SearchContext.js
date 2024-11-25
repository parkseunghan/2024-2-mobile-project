import React, { createContext, useState } from 'react';
import api from '@app/_utils/api';

// 추천 영상 더미 데이터
const DUMMY_RECOMMENDED_VIDEOS = [
    {
        id: 'dQw4w9WgXcQ',
        title: '초보자를 위한 요리 꿀팁 모음',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        channelTitle: '요리왕',
        description: '요리 초보자도 쉽게 따라할 수 있는 꿀팁 모음'
    },
    {
        id: 'jNQXAC9IVRw',
        title: '스마트폰 배터리 절약하는 방법',
        thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg',
        channelTitle: '테크튜브',
        description: '배터리 수명을 2배로 늘리는 방법'
    },
    {
        id: '9bZkp7q19f0',
        title: '집에서 하는 운동 루틴',
        thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg',
        channelTitle: '홈트여신',
        description: '장비 없이 집에서 하는 전신 운동'
    },
    {
        id: 'M7lc1UVf-VE',
        title: '효과적인 공부법 5가지',
        thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg',
        channelTitle: '공부의신',
        description: '성적을 올리는 학습 비법 공개'
    },
    {
        id: 'tgbNymZ7vqY',
        title: '차량 관리 필수 팁',
        thumbnail: 'https://i.ytimg.com/vi/tgbNymZ7vqY/mqdefault.jpg',
        channelTitle: '카닥터',
        description: '자동차 수명을 늘리는 관리 방법'
    }
];

export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [recommendedVideos, setRecommendedVideos] = useState(DUMMY_RECOMMENDED_VIDEOS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToSearchHistory = async (query) => {
        try {
            await api.post('/search/history', { query });
            await loadSearchHistory();
        } catch (error) {
            console.error('검색 기록 저장 실패:', error);
        }
    };

    const loadSearchHistory = async () => {
        try {
            const response = await api.get('/search/history');
            setSearchHistory(response.data.history);
        } catch (error) {
            console.error('검색 기록 로드 실패:', error);
        }
    };

    const clearAllSearchHistory = async () => {
        try {
            await api.delete('/search/history');
            setSearchHistory([]);
        } catch (error) {
            console.error('검색 기록 삭제 실패:', error);
        }
    };

    const clearSearchResults = () => {
        setSearchResults([]);
        setSearchQuery('');
    };

    const clearAll = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchHistory([]);
    };

    // 추천 영상 새로고침 (실제로는 API 호출하여 새로운 추천 영상을 가져올 수 있음)
    const refreshRecommendedVideos = () => {
        setRecommendedVideos([...DUMMY_RECOMMENDED_VIDEOS].sort(() => Math.random() - 0.5));
    };

    const deleteSearchHistoryItem = async (query) => {
        try {
            await api.delete(`/search/history/${encodeURIComponent(query)}`);
            await loadSearchHistory();
        } catch (error) {
            console.error('검색 기록 항목 삭제 실패:', error);
        }
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
            searchHistory,
            setSearchHistory,
            recommendedVideos,
            refreshRecommendedVideos,
            addToSearchHistory,
            clearSearchResults,
            clearAllSearchHistory,
            clearAll,
            loading,
            error,
            deleteSearchHistoryItem,
        }}>
            {children}
        </SearchContext.Provider>
    );
} 