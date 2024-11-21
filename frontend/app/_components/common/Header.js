import React, { useState, useContext, useCallback, useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { Menu } from './Menu';
import { SearchBar } from '@app/_components/main/SearchBar';
import { SearchContext } from '@app/_context/SearchContext';
import { searchVideos } from '@app/_utils/youtubeApi';
import { typography } from '@app/_styles/typography';
import SearchScreen from '@app/_screens/SearchScreen';

export function Header({ title, showBackButton, hideSearchBar = false, isSearchPage = false }) {
    const router = useRouter();
    const { user } = useAuth();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const isProcessingRef = useRef(false);
    const modalTimeoutRef = useRef(null);
    const {
        searchQuery,
        setSearchQuery,
        setSearchResults,
        addToSearchHistory,
    } = useContext(SearchContext);

    const handleBackPress = () => {
        router.back();
    };

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await searchVideos(searchQuery);
            setSearchResults(results || []);
            if (user) {
                await addToSearchHistory(searchQuery);
            }
            router.push('/(tabs)/home');
        } catch (error) {
            console.error('검색 에러:', error);
            setSearchResults([]);
        }
    }, [searchQuery, user]);

    // 컴포넌트 언마운트 시 타이머 정리
    React.useEffect(() => {
        return () => {
            if (modalTimeoutRef.current) {
                clearTimeout(modalTimeoutRef.current);
            }
        };
    }, []);

    const handleSearchFocus = useCallback(() => {
        if (isProcessingRef.current || isSearchVisible) return;
        
        isProcessingRef.current = true;
        
        // 이전 타이머가 있다면 제거
        if (modalTimeoutRef.current) {
            clearTimeout(modalTimeoutRef.current);
        }

        // 새로운 타이머 설정
        modalTimeoutRef.current = setTimeout(() => {
            setIsSearchVisible(true);
            isProcessingRef.current = false;
        }, 100);
    }, [isSearchVisible]);

    const handleSearchClose = useCallback(() => {
        if (isProcessingRef.current) return;
        
        isProcessingRef.current = true;
        setIsSearchVisible(false);
        
        // 약간의 지연 후 처리 플래그 초기화
        setTimeout(() => {
            isProcessingRef.current = false;
        }, 100);
    }, []);

    return (
        <>
            <View style={styles.header}>
                {showBackButton && (
                    <Pressable
                        onPress={handleBackPress}
                        style={styles.backButton}
                    >
                        <FontAwesome5
                            name="arrow-left"
                            size={24}
                            color={colors.text.primary}
                        />
                    </Pressable>
                )}

                <View style={styles.searchContainer}>
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSubmit={handleSearch}
                        onClear={() => setSearchQuery('')}
                        onFocus={handleSearchFocus}
                        autoFocus={isSearchPage}
                    />
                </View>

                {!isSearchPage && (
                    <View style={styles.rightContainer}>
                        <Pressable onPress={() => router.push('/profile')} style={styles.iconButton}>
                            {user ? (
                                <FontAwesome5 name="user-circle" size={24} color={colors.primary} />
                            ) : (
                                <FontAwesome5 name="user" size={24} color={colors.text.secondary} />
                            )}
                        </Pressable>
                        <Pressable
                            onPress={() => setIsMenuVisible(true)}
                            style={styles.iconButton}
                        >
                            <FontAwesome5 name="bars" size={24} color={colors.text.primary} />
                        </Pressable>
                    </View>
                )}
            </View>

            {isSearchVisible && (
                <SearchScreen
                    visible={isSearchVisible}
                    onClose={handleSearchClose}
                />
            )}

            <Menu
                isVisible={isMenuVisible}
                onClose={() => setIsMenuVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    searchContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minWidth: 80,
    },
    iconButton: {
        padding: spacing.xs,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    title: {
        ...typography.h2,
        flex: 1,
        textAlign: 'center',
    },
    searchBarButton: {
        flex: 1,
        height: 40,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
    },
    searchBarPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchPlaceholderText: {
        ...typography.body,
        color: colors.text.secondary,
        height: 30,
    },
}); 