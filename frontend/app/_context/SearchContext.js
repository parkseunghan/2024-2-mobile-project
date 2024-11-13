import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@app/_context/AuthContext';
import api from '@app/_utils/api';

export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const { user } = useContext(AuthContext);

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
        }}>
            {children}
        </SearchContext.Provider>
    );
} 