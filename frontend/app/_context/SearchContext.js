import React, { createContext, useState } from 'react';
import api from '@app/_utils/api';

/**
 * 검색 관련 상태 관리를 위한 Context
 * - 검색어 관리
 * - 검색 결과 관리
 * - 검색 기록 관리
 */
export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 검색 기록 추가
    const addToSearchHistory = async (query) => {
        try {
            await api.post('/search/history', { query });
            await loadSearchHistory();
        } catch (error) {
            console.error('검색 기록 저장 실패:', error);
        }
    };

    // 검색 기록 로드
    const loadSearchHistory = async () => {
        try {
            const response = await api.get('/search/history');
            setSearchHistory(response.data.history);
        } catch (error) {
            console.error('검색 기록 로드 실패:', error);
        }
    };

    // 검색 기록 전체 삭제
    const clearAllSearchHistory = async () => {
        try {
            await api.delete('/search/history');
            setSearchHistory([]);
        } catch (error) {
            console.error('검색 기록 삭제 실패:', error);
        }
    };

    // 검색 결과 초기화
    const clearSearchResults = () => {
        setSearchResults([]);
        setSearchQuery('');
    };

    // 모든 검색 관련 상태 초기화
    const clearAll = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchHistory([]);
    };

    // 검색 기록 항목 삭제
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