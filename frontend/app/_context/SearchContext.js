import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@app/_context/AuthContext';
import api from '@app/_utils/api';

// 추천 영상 더미 데이터
const DUMMY_RECOMMENDED_VIDEOS = [
    {
        id: '1',
        title: '초보자를 위한 요리 꿀팁 모음',
        thumbnail: 'https://i.ytimg.com/vi/example1/default.jpg',
        channelTitle: '요리왕',
        description: '요리 초보자도 쉽게 따라할 수 있는 꿀팁 모음'
    },
    {
        id: '2',
        title: '스마트폰 배터리 절약하는 방법',
        thumbnail: 'https://i.ytimg.com/vi/example2/default.jpg',
        channelTitle: '테크튜브',
        description: '배터리 수명을 2배로 늘리는 방법'
    },
    {
        id: '3',
        title: '집에서 하는 운동 루틴',
        thumbnail: 'https://i.ytimg.com/vi/example3/default.jpg',
        channelTitle: '홈트여신',
        description: '장비 없이 집에서 하는 전신 운동'
    },
    {
        id: '4',
        title: '효과적인 공부법 5가지',
        thumbnail: 'https://i.ytimg.com/vi/example4/default.jpg',
        channelTitle: '공부의신',
        description: '성적을 올리는 학습 비법 공개'
    },
    {
        id: '5',
        title: '차량 관리 필수 팁',
        thumbnail: 'https://i.ytimg.com/vi/example5/default.jpg',
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
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            loadSearchHistory();
        } else {
            setSearchHistory([]);
            clearSearchResults();
        }
    }, [user]);

    const loadSearchHistory = async () => {
        try {
            const response = await api.get('/search/history');
            setSearchHistory(response.data.history);
        } catch (error) {
            console.error('검색 기록 로드 실패:', error);
        }
    };

    const addToSearchHistory = async (query) => {
        if (user) {
            try {
                await api.post('/search/history', { query });
                await loadSearchHistory();
            } catch (error) {
                console.error('검색 기록 저장 실패:', error);
            }
        }
    };

    const clearAllSearchHistory = async () => {
        if (user) {
            try {
                await api.delete('/search/history');
                setSearchHistory([]);
            } catch (error) {
                console.error('검색 기록 삭제 실패:', error);
            }
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
        if (user) {
            try {
                await api.delete(`/search/history/${encodeURIComponent(query)}`);
                await loadSearchHistory();
            } catch (error) {
                console.error('검색 기록 항목 삭제 실패:', error);
            }
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