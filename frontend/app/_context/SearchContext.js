import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '@app/_context/AuthContext';
import { youtubeApi } from '@app/_lib/api/youtube';
import { searchApi } from '@app/_lib/api/search';

/**
 * 검색 관련 상태 관리를 위한 Context
 * - 검색어 관리
 * - 검색 결과 관리
 * - 검색 기록 관리
 */
export const SearchContext = createContext();

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}

export function SearchProvider({ children }) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 사용자가 로그인했을 때 검색 기록 로드
    useEffect(() => {
        if (user) {
            loadSearchHistory();
        } else {
            setSearchHistory([]);
        }
    }, [user]);

    const handleSearch = async (query) => {
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            // 로그인한 사용자의 경우 검색 기록 저장
            if (user) {
                await addToSearchHistory(query.trim());
            }

            // 검색 실행
            const searchQueries = [
                query.trim(),
                `${query.trim()} 팁`,
                `${query.trim()} 꿀팁`,
                `${query.trim()} tip`
            ];

            const searchPromises = searchQueries.map(q => youtubeApi.search(q));
            const searchResults = await Promise.all(searchPromises);
            
            console.log('API Response:', searchResults); // API 응답 로깅

            // 응답 구조 확인 및 수정
            const combinedResults = searchResults
                .filter(response => response?.data?.videos) // videos 배열이 있는 응답만 필터링
                .map(response => response.data.videos)
                .flat()
                .filter((video, index, self) =>
                    index === self.findIndex((v) => 
                        (v.id?.videoId || v.id) === (video.id?.videoId || video.id)
                    )
                );

            console.log('Combined Results:', combinedResults); // 가공된 결과 로깅
            
            setSearchResults(combinedResults);
            setSearchQuery(query);
            setError(null);
        } catch (error) {
            console.error('검색 실패:', error);
            setError('검색에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 기록 추가
    const addToSearchHistory = async (query) => {
        try {
            // 중복 검색어 처리는 백엔드에서 처리됨
            const response = await searchApi.addSearchHistory(query);
            if (response.data?.success) {
                await loadSearchHistory();
            }
        } catch (error) {
            console.error('검색 기록 저장 실패:', error);
            return false;
        }
        return true;
    };

    // 검색 기록 로드
    const loadSearchHistory = async () => {
        try {
            setLoading(true);
            const response = await searchApi.getSearchHistory();
            if (response.data?.history) {
                // 중복 제거 및 최신 순으로 정렬
                const uniqueHistory = response.data.history.reduce((acc, current) => {
                    const exists = acc.find(item => item.query === current.query);
                    if (!exists) {
                        return [...acc, current];
                    }
                    return acc;
                }, []);
                
                // 날짜 기준 내림차순 정렬
                uniqueHistory.sort((a, b) => 
                    new Date(b.created_at) - new Date(a.created_at)
                );
                
                setSearchHistory(uniqueHistory);
            }
        } catch (error) {
            console.error('검색 기록 로드 실패:', error);
            setError('검색 기록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 기록 삭제
    const deleteSearchHistoryItem = async (query) => {
        try {
            await searchApi.deleteSearchHistory(query);
            await loadSearchHistory();
        } catch (error) {
            console.error('검색 기록 항목 삭제 실패:', error);
        }
    };

    // 검색 기록 전체 삭제
    const clearAllSearchHistory = async () => {
        try {
            await searchApi.clearSearchHistory();
            setSearchHistory([]);
        } catch (error) {
            console.error('검색 기록 전체 삭제 실패:', error);
        }
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
            searchHistory,
            handleSearch,
            addToSearchHistory,
            loadSearchHistory,
            clearAllSearchHistory,
            deleteSearchHistoryItem,
            loading,
            error,
            isAuthenticated: !!user
        }}>
            {children}
        </SearchContext.Provider>
    );
} 