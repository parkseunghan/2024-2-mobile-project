import React, { useState, useContext } from 'react';
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

export function Header({ title, showBackButton, hideSearchBar = false, isSearchPage = false }) {
    const router = useRouter();
    const { user } = useAuth();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const {
        searchQuery,
        setSearchQuery,
        setSearchResults,
        addToSearchHistory,
    } = useContext(SearchContext);

    const handleBackPress = () => {
        router.back();
    };

    const handleSearch = async () => {
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
    };

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
                    {isSearchPage ? (
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSubmit={handleSearch}
                            onClear={() => setSearchQuery('')}
                            autoFocus={true}
                        />
                    ) : (
                        <Pressable
                            onPress={() => router.push('/search')}
                            style={styles.searchBarButton}
                        >
                            <View style={styles.searchBarPlaceholder}>
                                <FontAwesome5 
                                    name="search" 
                                    size={16} 
                                    color={colors.text.secondary} 
                                    style={styles.searchIcon}
                                />
                                <Text style={styles.searchPlaceholderText}>
                                    검색어를 입력하세요
                                </Text>
                            </View>
                        </Pressable>
                    )}
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
    },
}); 